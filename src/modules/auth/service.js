import { prisma } from "../../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken, verifyToken, generateSixDigitCode } from "../../utils/helpers.js";
import { emailTemplates } from "../../utils/emailTemplates.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (data, deviceInfo = null) => {
  const { idToken, email, firstName, lastName, photoUrl } = data;

  if (!idToken) {
    return { status: 400, message: "Google ID token is required" };
  }

  let googleUser;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    googleUser = ticket.getPayload();
  } catch (error) {
    console.error("Google token verification failed:", error.message);
    return { status: 401, message: "Invalid Google token" };
  }

  if (!googleUser) {
    return { status: 401, message: "Invalid Google credentials" };
  }

  const googleEmail = googleUser.email;
  const googleFirstName = googleUser.given_name || firstName || "Google";
  const googleLastName = googleUser.family_name || lastName || "User";
  const googlePhoto = googleUser.picture || photoUrl || null;

  const existingUser = await prisma.systemUser.findFirst({
    where: { email: googleEmail.toLowerCase() },
  });

  if (existingUser) {
    const role = await prisma.role.findFirst({ where: { id: existingUser.userRole } });

    const now = new Date();
    await prisma.systemUser.update({
      where: { id: existingUser.id },
      data: {
        lastLogin: now,
        isLoggedIn: true,
        loginCount: (existingUser.loginCount || 0n) + 1n,
      },
    });

    if (deviceInfo) {
      await logSuccessfulLogin(existingUser, deviceInfo);
    }

    const token = generateToken(existingUser);

    return {
      status: 200,
      message: "Google login successful",
      data: {
        token,
        tokenType: "Bearer",
        username: existingUser.username,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        profilePhotoUrl: existingUser.profilePhotoUrl,
        userRole: Number(existingUser.userRole),
        roleName: role?.roleName || "Member",
      },
    };
  }

  return {
    status: 201,
    message: "New Google user - please complete registration",
    data: {
      needsRegistration: true,
      googleId: googleUser.sub,
      email: googleEmail.toLowerCase(),
      firstName: googleFirstName,
      lastName: googleLastName,
      photoUrl: googlePhoto,
    },
  };
};

export const completeGoogleRegistration = async (data, deviceInfo = null) => {
  const { googleId, username, password, firstName, lastName, phoneNumber, gender, email, photoUrl } = data;

  if (!googleId) {
    return { status: 400, message: "Google ID is required" };
  }
  if (!username) {
    return { status: 400, message: "Username is required" };
  }
  if (!password) {
    return { status: 400, message: "Password is required" };
  }

  const existingUsername = await prisma.systemUser.findFirst({ where: { username: username.toLowerCase() } });
  if (existingUsername) {
    return { status: 401, message: "Username already exists, try another one" };
  }

  const userEmail = email ? email.toLowerCase() : `${googleId}@google.com`;
  
  const existingEmail = await prisma.systemUser.findFirst({ where: { email: userEmail } });
  if (existingEmail) {
    if (existingEmail.email.endsWith('@google.com')) {
      const updatedUser = await prisma.systemUser.update({
        where: { id: existingEmail.id },
        data: {
          username: username.toLowerCase(),
          firstName: firstName || existingEmail.firstName,
          lastName: lastName || existingEmail.lastName,
          profilePhotoUrl: photoUrl || existingEmail.profilePhotoUrl,
        },
      });
      
      const role = await prisma.role.findFirst({ where: { id: updatedUser.userRole } });
      await prisma.systemUser.update({
        where: { id: updatedUser.id },
        data: { isLoggedIn: true, loginCount: (updatedUser.loginCount || 0n) + 1n, lastLogin: new Date() },
      });

      const token = generateToken(updatedUser);
      return {
        status: 200,
        message: "Login successful",
        data: {
          token,
          tokenType: "Bearer",
          username: updatedUser.username,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          profilePhotoUrl: updatedUser.profilePhotoUrl,
          userRole: Number(updatedUser.userRole),
          roleName: role?.roleName || "Member",
        },
      };
    }
    return { status: 401, message: "Email already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.systemUser.create({
    data: {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName: firstName || "Google",
      lastName: lastName || "User",
      phoneNumber: phoneNumber || "",
      gender: gender || "Not specified",
      userRole: 2n,
      emailVerified: true,
      status: true,
      loginCount: 0n,
      profilePhotoUrl: photoUrl || null,
    },
  });

  const role = await prisma.role.findFirst({ where: { id: user.userRole } });

  const now = new Date();
  await prisma.systemUser.update({
    where: { id: user.id },
    data: {
      lastLogin: now,
      isLoggedIn: true,
      loginCount: 1n,
    },
  });

  if (deviceInfo) {
    await logSuccessfulLogin(user, deviceInfo);
  }

  const token = generateToken(user);

  return {
    status: 200,
    message: "Account created successfully",
    data: {
      token,
      tokenType: "Bearer",
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePhotoUrl: user.profilePhotoUrl,
      userRole: Number(user.userRole),
      roleName: role?.roleName || "Member",
    },
  };
};

export const register = async (data) => {
  const { username, email, password, firstName, lastName, phoneNumber, dateOfBirth, gender, userRole } = data;

  if (!password) {
    return { status: 400, message: "Password is required" };
  }

  const existingUser = await prisma.systemUser.findFirst({ where: { username } });
  if (existingUser) {
    return { status: 401, message: "Username already exists, try another one" };
  }

  const existingEmail = await prisma.systemUser.findFirst({ where: { email: email.toLowerCase() } });
  if (existingEmail) {
    return { status: 401, message: "Email already exists, try another email address" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const code = generateSixDigitCode();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const user = await prisma.systemUser.create({
    data: {
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      ...(dateOfBirth && !isNaN(Date.parse(dateOfBirth)) && { dateOfBirth: new Date(dateOfBirth) }),
      gender,
      userRole: userRole || 2n,
      emailVerified: false,
      status: true,
      loginCount: 0n,
    },
  });

  await prisma.verification.create({
    data: {
      code,
      verificationType: "Email Verification",
      emailAddress: user.email,
      createdBy: user.id,
      expiresAt,
      status: false,
    },
  });

  const verificationEmail = emailTemplates.verification(code, user.firstName);

  await prisma.message.create({
    data: {
      message: verificationEmail.html,
      recipient: user.email,
      subject: verificationEmail.subject,
      status: "PENDING",
      sendCount: 0n,
      createdBy: user.id,
    },
  });

  return { status: 200, message: "Account created successfully, please verify your email before logging in" };
};

export const verifyAccount = async (data) => {
  const { email, code } = data;

  if (!email || !code) {
    return { status: 400, message: "Email and code are required" };
  }

  const user = await prisma.systemUser.findFirst({ where: { email: email.toLowerCase() } });
  if (!user) {
    return { status: 404, message: "User with the provided email does not exist" };
  }

  const verification = await prisma.verification.findFirst({
    where: {
      emailAddress: user.email,
      code,
      verificationType: "Email Verification",
      status: false,
    },
  });

  if (!verification) {
    return { status: 400, message: "Invalid verification code" };
  }

  if (new Date() > verification.expiresAt) {
    return { status: 400, message: "Verification code has expired" };
  }

  await prisma.verification.update({
    where: { id: verification.id },
    data: { status: true },
  });

  await prisma.systemUser.update({
    where: { id: user.id },
    data: { emailVerified: true },
  });

  return { status: 200, message: "Email verified successfully" };
};

export const verifyCode = async (data) => {
  const { email, code } = data;

  if (!email || !code) {
    return { status: 400, message: "Email and code are required" };
  }

  const user = await prisma.systemUser.findFirst({ where: { email: email.toLowerCase() } });
  if (!user) {
    return { status: 404, message: "User with the provided email does not exist" };
  }

  const verification = await prisma.verification.findFirst({
    where: {
      emailAddress: user.email,
      code,
      verificationType: "Email Verification",
      status: false,
    },
  });

  if (!verification) {
    return { status: 400, message: "Invalid verification code" };
  }

  if (new Date() > verification.expiresAt) {
    return { status: 400, message: "Verification code has expired" };
  }

  const allPendingCodes = await prisma.verification.findMany({
    where: {
      emailAddress: user.email,
      verificationType: "Email Verification",
      status: false,
    },
  });

  if (allPendingCodes.length > 0) {
    await prisma.verification.updateMany({
      where: {
        emailAddress: user.email,
        verificationType: "Email Verification",
        status: false,
      },
      data: { status: true },
    });
  }

  return { status: 200, message: "Verification code has been verified" };
};

export const login = async (data, deviceInfo = null) => {
  const { username, password } = data;

  if (!username || !password) {
    return { status: 400, message: "Username and password are required" };
  }

  const user = await prisma.systemUser.findFirst({
    where: { OR: [{ username }, { email: username.toLowerCase() }] },
  });

  if (!user) {
    if (deviceInfo) {
      await logFailedLoginAttempt(username, deviceInfo);
    }
    return { status: 401, message: "Incorrect username or password" };
  }

  if (!user.emailVerified) {
    const existingCodes = await prisma.verification.findMany({
      where: {
        emailAddress: user.email,
        verificationType: "Email Verification",
        status: false,
      },
    });

    if (existingCodes.length <= 2) {
      const code = generateSixDigitCode();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const verificationEmail = emailTemplates.verification(code, user.firstName);

      await prisma.message.create({
        data: {
          message: verificationEmail.html,
          recipient: user.email,
          subject: verificationEmail.subject,
          status: "PENDING",
          sendCount: 0n,
          createdBy: user.id,
        },
      });

      await prisma.verification.create({
        data: {
          code,
          verificationType: "Email Verification",
          emailAddress: user.email,
          createdBy: user.id,
          expiresAt,
          status: false,
        },
      });
    }

    return { 
      status: 405, 
      message: "Email not verified. A verification code has been sent to your email. Please verify before logging in.",
      data: { needsVerification: true, email: user.email }
    };
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    if (deviceInfo) {
      await logFailedLoginAttempt(username, deviceInfo);
    }
    return { status: 401, message: "Incorrect username or password" };
  }

  const role = await prisma.role.findFirst({ where: { id: user.userRole } });

  const now = new Date();
  await prisma.systemUser.update({
    where: { id: user.id },
    data: {
      lastLogin: now,
      isLoggedIn: true,
      loginCount: (user.loginCount || 0n) + 1n,
    },
  });

  if (deviceInfo) {
    await logSuccessfulLogin(user, deviceInfo);
  }

  const token = generateToken(user);

  return {
    status: 200,
    message: "Login successful",
    data: {
      token,
      tokenType: "Bearer",
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePhotoUrl: user.profilePhotoUrl,
      userRole: Number(user.userRole),
      roleName: role?.roleName || "Member",
    },
  };
};

const logSuccessfulLogin = async (user, deviceInfo) => {
  try {
    await prisma.activity.create({
      data: {
        userId: String(user.id),
        username: user.username,
        email: user.email,
        ip: deviceInfo.ip || null,
        userAgent: deviceInfo.userAgent || null,
        browserName: deviceInfo.browserName || null,
        os: deviceInfo.os || null,
        deviceType: deviceInfo.deviceType || null,
        deviceName: deviceInfo.deviceName || null,
        engine: deviceInfo.engine || null,
        locale: deviceInfo.locale || null,
        success: true,
        loggedInAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error logging login activity:", error);
  }
};

const logFailedLoginAttempt = async (username, deviceInfo) => {
  try {
    const user = await prisma.systemUser.findFirst({
      where: { OR: [{ username }, { email: username.toLowerCase() }] },
    });

    await prisma.activity.create({
      data: {
        userId: user ? String(user.id) : null,
        username: username,
        email: user?.email || null,
        ip: deviceInfo.ip || null,
        userAgent: deviceInfo.userAgent || null,
        browserName: deviceInfo.browserName || null,
        os: deviceInfo.os || null,
        deviceType: deviceInfo.deviceType || null,
        deviceName: deviceInfo.deviceName || null,
        engine: deviceInfo.engine || null,
        locale: deviceInfo.locale || null,
        success: false,
        failureReason: "Invalid credentials",
        loggedInAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error logging failed login attempt:", error);
  }
};

export const logFailedLogin = async (data) => {
  const { username, deviceInfo } = data;
  
  if (!username || !deviceInfo) {
    return { status: 400, message: "Username and device info are required" };
  }

  await logFailedLoginAttempt(username, deviceInfo);
  return { status: 200, message: "Failed login logged" };
};

export const refreshToken = async (userId) => {
  const user = await prisma.systemUser.findUnique({ where: { id: userId } });

  if (!user || !user.isLoggedIn) {
    return { status: 401, message: "Cannot refresh token: User is logged out" };
  }

  const role = await prisma.role.findFirst({ where: { id: user.userRole } });
  const token = generateToken(user);

  return {
    status: 200,
    message: "Token refreshed successfully",
    data: {
      token,
      tokenType: "Bearer",
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePhotoUrl: user.profilePhotoUrl,
      userRole: user.userRole,
      roleName: role?.roleName || "Member",
    },
  };
};

export const logout = async (userId) => {
  await prisma.systemUser.update({
    where: { id: userId },
    data: {
      isLoggedIn: false,
      lastLogin: new Date(),
    },
  });

  await prisma.activity.updateMany({
    where: { userId, loggedOutAt: null },
    data: { loggedOutAt: new Date() },
  });

  return { status: 200, message: "Logout successful" };
};

export const getCurrentUser = async (userId) => {
  const user = await prisma.systemUser.findUnique({ where: { id: userId } });
  if (!user) {
    return { status: 404, message: "User not found" };
  }
  
  const serializeUser = (u) => {
    const obj = { ...u };
    obj.password = null;
    for (const key of Object.keys(obj)) {
      if (obj[key] instanceof Date) {
        obj[key] = obj[key].toISOString();
      } else if (typeof obj[key] === "bigint") {
        obj[key] = Number(obj[key]);
      }
    }
    return obj;
  };
  
  return { status: 200, message: "User details fetched successfully", data: serializeUser(user) };
};

export const updateCurrentUser = async (userId, data) => {
  const user = await prisma.systemUser.findUnique({ where: { id: userId } });
  if (!user) {
    return { status: 404, message: "User not found" };
  }

  const updateData = {};
  if (data.firstName) updateData.firstName = data.firstName;
  if (data.lastName) updateData.lastName = data.lastName;
  if (data.middleName !== undefined) updateData.middleName = data.middleName;
  if (data.dateOfBirth && !isNaN(Date.parse(data.dateOfBirth))) updateData.dateOfBirth = new Date(data.dateOfBirth);
  if (data.gender) updateData.gender = data.gender;
  if (data.maritalStatus !== undefined) updateData.maritalStatus = data.maritalStatus;
  if (data.email && data.email !== user.email) {
    const existingEmail = await prisma.systemUser.findFirst({
      where: { email: data.email.toLowerCase(), id: { not: user.id } },
    });
    if (existingEmail) {
      return { status: 400, message: "Email already exists" };
    }
    updateData.email = data.email.toLowerCase();
  }
  if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber;
  if (data.alternativePhone !== undefined) updateData.alternativePhone = data.alternativePhone;
  if (data.ministryGroup !== undefined) updateData.ministryGroup = data.ministryGroup;
  if (data.servicePosition !== undefined) updateData.servicePosition = data.servicePosition;
  if (data.spiritualGifts !== undefined) updateData.spiritualGifts = data.spiritualGifts;
  if (data.emergencyContactName !== undefined) updateData.emergencyContactName = data.emergencyContactName;
  if (data.emergencyContactPhone !== undefined) updateData.emergencyContactPhone = data.emergencyContactPhone;
  if (data.emergencyContactRelationship !== undefined) updateData.emergencyContactRelationship = data.emergencyContactRelationship;
  if (data.profilePhotoUrl !== undefined) updateData.profilePhotoUrl = data.profilePhotoUrl;

  updateData.updatedOn = new Date();
  updateData.updatedBy = user.id;

  const updatedUser = await prisma.systemUser.update({
    where: { id: user.id },
    data: updateData,
  });

  updatedUser.password = null;
  return { status: 200, message: "Your profile updated successfully", data: updatedUser };
};

export const resendVerification = async (data) => {
  const { email } = data;
  if (!email) {
    return { status: 400, message: "Email is required to generate verification code" };
  }

  const user = await prisma.systemUser.findFirst({ where: { email: email.toLowerCase() } });
  if (!user) {
    return { status: 404, message: "User with the provided email does not exist" };
  }

  const existingCodes = await prisma.verification.findMany({
    where: {
      emailAddress: user.email,
      verificationType: "Email Verification",
      status: false,
    },
  });

  if (existingCodes.length > 2) {
    return { status: 201, message: "A verification code has already been sent to your email. Please check your inbox or spam." };
  }

  const code = generateSixDigitCode();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const verificationEmail = emailTemplates.verification(code, user.firstName);

  await prisma.message.create({
    data: {
      message: verificationEmail.html,
      recipient: user.email,
      subject: verificationEmail.subject,
      status: "PENDING",
      sendCount: 0n,
      createdBy: user.id,
    },
  });

  await prisma.verification.create({
    data: {
      code,
      verificationType: "Email Verification",
      emailAddress: user.email,
      createdBy: user.id,
      expiresAt,
      status: false,
    },
  });

  return { status: 200, message: "New verification code generated and sent to your email" };
};

export const setPassword = async (data) => {
  const { email, password } = data;
  if (!email || !password) {
    return { status: 400, message: "Email and password are required" };
  }

  const user = await prisma.systemUser.findFirst({ where: { email: email.toLowerCase() } });
  if (!user) {
    return { status: 404, message: "User with the provided email does not exist" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.systemUser.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      updatedOn: new Date(),
      updatedBy: user.id,
    },
  });

  return { status: 200, message: "Password reset successfully" };
};

export const forgotPassword = async (data) => {
  const { email } = data;
  if (!email) {
    return { status: 400, message: "Email is required" };
  }

  const user = await prisma.systemUser.findFirst({ where: { email: email.toLowerCase() } });
  if (!user) {
    return { status: 404, message: "No account found with this email address" };
  }

  const existingCodes = await prisma.verification.findMany({
    where: {
      emailAddress: user.email,
      verificationType: "Password Reset",
      status: false,
    },
  });

  if (existingCodes.length > 2) {
    return { status: 201, message: "A reset code has already been sent to your email. Please check your inbox or spam." };
  }

  const code = generateSixDigitCode();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  const resetEmail = emailTemplates.passwordReset(code, user.firstName);

  await prisma.message.create({
    data: {
      message: resetEmail.html,
      recipient: user.email,
      subject: resetEmail.subject,
      status: "PENDING",
      sendCount: 0n,
      createdBy: user.id,
    },
  });

  await prisma.verification.create({
    data: {
      code,
      verificationType: "Password Reset",
      emailAddress: user.email,
      createdBy: user.id,
      expiresAt,
      status: false,
    },
  });

  return { status: 200, message: "Reset code sent to your email" };
};

export const resetPassword = async (data) => {
  const { email, code, newPassword } = data;
  if (!email || !code || !newPassword) {
    return { status: 400, message: "Email, code, and new password are required" };
  }

  const user = await prisma.systemUser.findFirst({ where: { email: email.toLowerCase() } });
  if (!user) {
    return { status: 404, message: "User with the provided email does not exist" };
  }

  const verification = await prisma.verification.findFirst({
    where: {
      emailAddress: user.email,
      code,
      verificationType: "Password Reset",
      status: false,
    },
  });

  if (!verification) {
    return { status: 400, message: "Invalid reset code" };
  }

  if (new Date() > verification.expiresAt) {
    return { status: 400, message: "Reset code has expired" };
  }

  const allPendingCodes = await prisma.verification.findMany({
    where: {
      emailAddress: user.email,
      verificationType: "Password Reset",
      status: false,
    },
  });

  if (allPendingCodes.length > 0) {
    await prisma.verification.updateMany({
      where: {
        emailAddress: user.email,
        verificationType: "Password Reset",
        status: false,
      },
      data: { status: true },
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.systemUser.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      updatedOn: new Date(),
      updatedBy: user.id,
    },
  });

  return { status: 200, message: "Password reset successfully" };
};

export const updatePassword = async (userId, data) => {
  const { currentPassword, newPassword } = data;
  
  if (!currentPassword || !newPassword) {
    return { status: 400, message: "Current password and new password are required" };
  }

  const user = await prisma.systemUser.findUnique({ where: { id: userId } });
  if (!user) {
    return { status: 404, message: "User not found" };
  }

  const isValidPassword = await bcrypt.compare(currentPassword, user.password);
  if (!isValidPassword) {
    return { status: 422, message: "Current password is incorrect" };
  }

  if (newPassword.length < 8) {
    return { status: 400, message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.systemUser.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      updatedOn: new Date(),
      updatedBy: user.id,
    },
  });

  return { status: 200, message: "Password updated successfully" };
};