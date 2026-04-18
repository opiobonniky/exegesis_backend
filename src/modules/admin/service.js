import { prisma } from "../../config/db.js";

export const getUsersByAdmin = async (data, adminId) => {
  const { search, userId, page = 1, pageSize = 10 } = data;
  const pageNum = parseInt(page) || 1;
  const pageSizeNum = Math.min(parseInt(pageSize) || 10, 100);
  const offset = (pageNum - 1) * pageSizeNum;

  const whereClause = {};
  if (userId) {
    whereClause.id = userId;
  } else if (search) {
    whereClause.OR = [
      { username: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, totalCount] = await Promise.all([
    prisma.systemUser.findMany({
      where: whereClause,
      skip: offset,
      take: pageSizeNum,
      orderBy: { createdOn: "desc" },
    }),
    prisma.systemUser.count({ where: whereClause }),
  ]);

  const serializeBigInt = (val) => {
    if (val === null || val === undefined) return val;
    if (typeof val === "bigint") return Number(val);
    if (Array.isArray(val)) return val.map(serializeBigInt);
    if (typeof val === "object") {
      return Object.fromEntries(
        Object.entries(val).map(([k, v]) => [k, serializeBigInt(v)])
      );
    }
    return val;
  };

  const usersWithoutPassword = users.map((u) => {
    const { password, ...rest } = u;
    return serializeBigInt({ ...rest, password: null });
  });
  const totalPages = Math.ceil(totalCount / pageSizeNum);

  return {
    status: 200,
    message: "Users fetched successfully",
    data: {
      users: usersWithoutPassword,
      totalCount,
      page: pageNum,
      pageSize: pageSizeNum,
      totalPages,
    },
  };
};

export const updateUser = async (data, adminId) => {
  const { username, firstName, lastName, middleName, gender, maritalStatus, phoneNumber, email, roleName, roleId, status } = data;

  if (!username) {
    return { status: 400, message: "Username is required" };
  }

  const user = await prisma.systemUser.findFirst({ where: { username } });
  if (!user) {
    return { status: 404, message: "User not found" };
  }

  const updateData = {};
  if (firstName) updateData.firstName = firstName.trim();
  if (lastName) updateData.lastName = lastName.trim();
  if (middleName !== undefined) updateData.middleName = middleName?.trim() || null;
  if (gender) updateData.gender = gender;
  if (maritalStatus !== undefined) updateData.maritalStatus = maritalStatus;
  if (phoneNumber) updateData.phoneNumber = phoneNumber.trim();
  if (email) {
    const newEmail = email.trim().toLowerCase();
    if (newEmail !== user.email) {
      const existingEmail = await prisma.systemUser.findFirst({
        where: { email: newEmail, id: { not: user.id } },
      });
      if (existingEmail) {
        return { status: 400, message: "Email is already in use by another account" };
      }
      updateData.email = newEmail;
    }
  }
  if (roleName) {
    const roleNameLower = roleName.trim().toLowerCase();
    updateData.userRole = roleId ? BigInt(roleId) : (roleNameLower === "admin" ? 1n : 2n);
  } else if (roleId) {
    updateData.userRole = BigInt(roleId);
  }
  if (status !== undefined) updateData.status = status;

  updateData.updatedOn = new Date();
  updateData.updatedBy = adminId;

  const updatedUser = await prisma.systemUser.update({
    where: { id: user.id },
    data: updateData,
  });

  updatedUser.password = null;
  const serializeUser = (u) => {
    const serialized = {};
    for (const key of Object.keys(u)) {
      const value = u[key];
      serialized[key] = typeof value === "bigint" ? value.toString() : value;
    }
    return serialized;
  };
  return { status: 200, message: "User updated successfully", data: serializeUser(updatedUser) };
};

export const deleteUser = async (data, adminId) => {
  const { username } = data;
  if (!username) {
    return { status: 400, message: "Username is required" };
  }

  const user = await prisma.systemUser.findFirst({ where: { username } });
  if (!user) {
    return { status: 404, message: "User not found" };
  }

  if (user.id === adminId) {
    return { status: 403, message: "You cannot delete your own account" };
  }

  await prisma.activity.deleteMany({ where: { userId: user.id } });
  await prisma.highlight.deleteMany({ where: { createdBy: user.id } });
  await prisma.favorite.deleteMany({ where: { createdBy: user.id } });
  await prisma.note.deleteMany({ where: { createdBy: user.id } });
  await prisma.readHistory.deleteMany({ where: { createdBy: user.id } });
  await prisma.userQuizAnswer.deleteMany({ where: { userId: user.id } });
  await prisma.userPlanProgress.deleteMany({ where: { userId: user.id } });
  await prisma.verification.deleteMany({ where: { createdBy: user.id } });
  await prisma.message.deleteMany({ where: { createdBy: user.id } });

  await prisma.systemUser.delete({ where: { id: user.id } });

  return { status: 200, message: "User and all associated activity deleted successfully" };
};

export const toggleUserStatus = async (data, adminId) => {
  const { username, status } = data;
  if (!username) {
    return { status: 400, message: "Username is required" };
  }

  const user = await prisma.systemUser.findFirst({ where: { username } });
  if (!user) {
    return { status: 404, message: "User not found" };
  }

  if (user.id === adminId) {
    return { status: 403, message: "You cannot change your own account status" };
  }

  const newStatus = status !== undefined ? status : !user.status;
  await prisma.systemUser.update({
    where: { id: user.id },
    data: { status: newStatus, updatedOn: new Date(), updatedBy: adminId },
  });

  const msg = newStatus ? "User activated successfully" : "User deactivated successfully";
  return { status: 200, message: msg };
};

export const toggleUserVerification = async (data, adminId) => {
  const { username, isVerified } = data;
  if (!username) {
    return { status: 400, message: "Username is required" };
  }

  const user = await prisma.systemUser.findFirst({ where: { username } });
  if (!user) {
    return { status: 404, message: "User not found" };
  }

  const newVerified = isVerified !== undefined ? isVerified : !user.emailVerified;
  await prisma.systemUser.update({
    where: { id: user.id },
    data: { emailVerified: newVerified, updatedOn: new Date(), updatedBy: adminId },
  });

  const msg = newVerified ? "User email verified successfully" : "User email verification revoked";
  return { status: 200, message: msg };
};

export const getAdminDashboardStats = async () => {
  const [totalUsers, activeUsers, inactiveUsers, verifiedUsers, unverifiedUsers, adminCount, memberCount, totalPlans, activePlans, totalEnrollments, completedEnrollments] = await Promise.all([
    prisma.systemUser.count(),
    prisma.systemUser.count({ where: { status: true } }),
    prisma.systemUser.count({ where: { status: false } }),
    prisma.systemUser.count({ where: { emailVerified: true } }),
    prisma.systemUser.count({ where: { emailVerified: false } }),
    prisma.systemUser.count({ where: { userRole: 1n } }),
    prisma.systemUser.count({ where: { userRole: 2n } }),
    prisma.readingPlan.count(),
    prisma.readingPlan.count({ where: { isActive: true } }),
    prisma.userPlanProgress.count(),
    prisma.userPlanProgress.count({ where: { isCompleted: true } }),
  ]);

  const serializeBigInt = (val) => {
    if (val === null || val === undefined) return val;
    if (typeof val === "bigint") return Number(val);
    if (Array.isArray(val)) return val.map(serializeBigInt);
    if (typeof val === "object") {
      return Object.fromEntries(
        Object.entries(val).map(([k, v]) => [k, serializeBigInt(v)])
      );
    }
    return val;
  };

  return {
    status: 200,
    message: "Dashboard stats retrieved successfully",
    data: serializeBigInt({
      totalUsers,
      activeUsers,
      inactiveUsers,
      verifiedUsers,
      unverifiedUsers,
      adminCount,
      memberCount,
      newUsersThisMonth: totalUsers,
      totalPlans,
      activePlans,
      totalEnrollments,
      completedEnrollments,
      activeRate: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 1000) / 10 : 0,
      verificationRate: totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 1000) / 10 : 0,
      completionRate: totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 1000) / 10 : 0,
    }),
  };
};

export const getUserActivity = async (data) => {
  const { username, page = 1, pageSize = 10 } = data;
  if (!username) {
    return { status: 400, message: "Username is required" };
  }

  const user = await prisma.systemUser.findFirst({ where: { username } });
  if (!user) {
    return { status: 404, message: "User not found" };
  }

  const pageNum = parseInt(page) || 1;
  const pageSizeNum = Math.min(parseInt(pageSize) || 10, 50);
  const offset = (pageNum - 1) * pageSizeNum;

  const [activities, totalCount] = await Promise.all([
    prisma.activity.findMany({
      where: { userId: user.id },
      orderBy: { loggedInAt: "desc" },
      skip: offset,
      take: pageSizeNum,
    }),
    prisma.activity.count({ where: { userId: user.id } }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSizeNum);

  return {
    status: 200,
    message: "Activity fetched successfully",
    data: {
      sessions: activities,
      totalCount,
      page: pageNum,
      pageSize: pageSizeNum,
      totalPages,
    },
  };
};

export const getAllActivity = async (data) => {
  const { page = 1, pageSize = 20, username, success, deviceType, onlineOnly, endedOnly } = data;
  const pageNum = parseInt(page) || 1;
  const pageSizeNum = Math.min(parseInt(pageSize) || 20, 100);
  const offset = (pageNum - 1) * pageSizeNum;

  const whereClause = {};
  
  if (username) {
    whereClause.username = { contains: username, mode: "insensitive" };
  }
  
  if (success !== undefined) {
    whereClause.success = success;
  }
  
  if (deviceType && deviceType !== "all") {
    whereClause.deviceType = deviceType;
  }
  
  if (onlineOnly) {
    whereClause.loggedOutAt = null;
    whereClause.success = true;
  }
  
  if (endedOnly) {
    whereClause.loggedOutAt = { not: null };
  }

  const [activities, totalCount] = await Promise.all([
    prisma.activity.findMany({
      where: whereClause,
      orderBy: { loggedInAt: "desc" },
      skip: offset,
      take: pageSizeNum,
    }),
    prisma.activity.count({ where: whereClause }),
  ]);

  const serializeBigInt = (val) => {
    if (val === null || val === undefined) return val;
    if (typeof val === "bigint") return Number(val);
    if (Array.isArray(val)) return val.map(serializeBigInt);
    if (typeof val === "object") {
      return Object.fromEntries(
        Object.entries(val).map(([k, v]) => [k, serializeBigInt(v)])
      );
    }
    return val;
  };

  const sessions = serializeBigInt(activities);

  const summary = {
    successCount: await prisma.activity.count({ where: { success: true } }),
    failedCount: await prisma.activity.count({ where: { success: false } }),
    onlineCount: await prisma.activity.count({ where: { loggedOutAt: null, success: true } }),
  };

  const totalPages = Math.ceil(totalCount / pageSizeNum);

  return {
    status: 200,
    message: "Activity fetched successfully",
    data: {
      sessions,
      totalCount,
      page: pageNum,
      pageSize: pageSizeNum,
      totalPages,
      summary,
    },
  };
};

export const deleteActivity = async (data) => {
  const { activityId } = data;
  if (!activityId) {
    return { status: 400, message: "Activity ID is required" };
  }

  await prisma.activity.delete({ where: { id: BigInt(activityId) } });
  return { status: 200, message: "Activity deleted successfully" };
};

export const addDailyVerse = async (data, adminId) => {
  const { id, bookName, chapter, verseNumber, displayDate, displayTime, reflection, published } = data;

  if (!bookName || !chapter || !verseNumber || !displayDate) {
    return { status: 400, message: "bookName, chapter, verseNumber, and displayDate are required" };
  }

  let dailyVerse;
  if (id) {
    dailyVerse = await prisma.dailyVerse.update({
      where: { id: BigInt(id) },
      data: {
        bookName,
        chapter: BigInt(chapter),
        verseNumber: BigInt(verseNumber),
        displayDate: new Date(displayDate),
        displayTime: displayTime ? new Date(displayTime) : null,
        reflection,
        isPublished: published ?? true,
        updatedBy: adminId,
      },
    });
  } else {
    dailyVerse = await prisma.dailyVerse.create({
      data: {
        bookName,
        chapter: BigInt(chapter),
        verseNumber: BigInt(verseNumber),
        displayDate: new Date(displayDate),
        displayTime: displayTime ? new Date(displayTime) : null,
        reflection,
        createdBy: adminId,
        isPublished: published ?? true,
      },
    });
  }

  const serializeBigInt = (val) => {
    if (val === null || val === undefined) return val;
    if (typeof val === "bigint") return Number(val);
    if (Array.isArray(val)) return val.map(serializeBigInt);
    if (typeof val === "object") {
      return Object.fromEntries(
        Object.entries(val).map(([k, v]) => [k, serializeBigInt(v)])
      );
    }
    return val;
  };

  const msg = id ? "Daily verse updated successfully" : "Daily verse added successfully";
  return { status: 200, message: msg, data: serializeBigInt(dailyVerse) };
};

export const getAllDailyVerses = async (data) => {
  const { page = 0, size = 12, startDate, endDate, smartDefault, futureDays = 2 } = data || {};
  const pageNum = parseInt(page) || 0;
  const pageSize = Math.min(parseInt(size) || 12, 50);
  const offset = pageNum * pageSize;

  const whereClause = {};

  if (startDate || endDate) {
    whereClause.displayDate = {};
    if (startDate) whereClause.displayDate.gte = new Date(startDate);
    if (endDate) whereClause.displayDate.lte = new Date(endDate);
  }

  if (smartDefault) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + parseInt(futureDays));

    whereClause.displayDate = { gte: today, lte: futureDate };
  }

  const [dailyVerses, totalElements] = await Promise.all([
    prisma.dailyVerse.findMany({
      where: whereClause,
      orderBy: { displayDate: "desc" },
      skip: offset,
      take: pageSize,
    }),
    prisma.dailyVerse.count({ where: whereClause }),
  ]);

  const serializeBigInt = (val) => {
    if (val === null || val === undefined) return val;
    if (typeof val === "bigint") return Number(val);
    if (Array.isArray(val)) return val.map(serializeBigInt);
    if (typeof val === "object") {
      return Object.fromEntries(
        Object.entries(val).map(([k, v]) => [k, serializeBigInt(v)])
      );
    }
    return val;
  };

  const totalPages = Math.ceil(totalElements / pageSize);
  const content = serializeBigInt(dailyVerses);

  return {
    status: 200,
    message: "Daily verses fetched successfully",
    data: {
      content,
      currentPage: pageNum,
      pageSize,
      totalElements,
      totalPages,
      hasNext: pageNum < totalPages - 1,
      hasPrevious: pageNum > 0,
      isFirst: pageNum === 0,
      isLast: pageNum >= totalPages - 1,
    },
  };
};

export const deleteDailyVerse = async (data) => {
  const { verseId, id } = data;
  const targetId = verseId || id;
  if (!targetId) {
    return { status: 400, message: "Verse ID is required" };
  }

  await prisma.dailyVerse.delete({ where: { id: BigInt(targetId) } });
  return { status: 200, message: "Daily verse deleted successfully" };
};