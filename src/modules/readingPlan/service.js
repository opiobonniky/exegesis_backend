import { prisma } from "../../config/db.js";
import { generatePlanId } from "../../utils/helpers.js";

export const createReadingPlan = async (data, userId) => {
  const { title, description, totalDays, questionsEnabled, category, difficulty } = data;
  if (!title || !totalDays) return { status: 400, message: "Title and totalDays are required" };

  const planId = generatePlanId();
  const readingPlan = await prisma.readingPlan.create({
    data: { planId, title, description, totalDays, questionsEnabled: questionsEnabled || false, category, difficulty, isActive: true, createdBy: userId },
  });

  const serializeBigInt = (val) => {
    if (typeof val === "bigint") return Number(val);
    if (Array.isArray(val)) return val.map(serializeBigInt);
    if (val && typeof val === "object") return Object.fromEntries(Object.entries(val).map(([k, v]) => [k, serializeBigInt(v)]));
    return val;
  };

  return { status: 200, message: "Reading plan created successfully", data: serializeBigInt(readingPlan) };
};

export const deleteReadingPlan = async (data) => {
  const { planId } = data;
  if (!planId) return { status: 400, message: "Plan ID is required" };

  await prisma.readingPlan.delete({ where: { planId } });
  return { status: 200, message: "Reading plan deleted successfully" };
};

export const addDailyAssignment = async (data, userId) => {
  const { planId, dayNumber, title, chapters, reflectionQuestions } = data;
  if (!planId || !dayNumber || !chapters) return { status: 400, message: "planId, dayNumber, and chapters are required" };

  const assignment = await prisma.dailyAssignment.create({
    data: { planId, dayNumber, title, chaptersJson: JSON.stringify(chapters), reflectionQuestions: reflectionQuestions ? JSON.stringify(reflectionQuestions) : null, createdBy: userId },
  });

  const serializeBigInt = (val) => {
    if (typeof val === "bigint") return Number(val);
    if (Array.isArray(val)) return val.map(serializeBigInt);
    if (val && typeof val === "object") return Object.fromEntries(Object.entries(val).map(([k, v]) => [k, serializeBigInt(v)]));
    return val;
  };

  return { status: 200, message: "Daily assignment added successfully", data: serializeBigInt(assignment) };
};

export const addQuizQuestions = async (data, userId) => {
  const { planId, dayNumber, questions } = data;
  if (!planId || !dayNumber || !questions || !Array.isArray(questions)) return { status: 400, message: "planId, dayNumber, and questions array are required" };

  const createdQuestions = await Promise.all(
    questions.map((q) =>
      prisma.quizQuestion.create({
        data: { planId, dayNumber, question: q.question, optionsJson: JSON.stringify(q.options), correctAnswer: q.correctAnswer, explanation: q.explanation, createdBy: userId },
      })
    )
  );

  const serializeBigInt = (val) => {
    if (typeof val === "bigint") return Number(val);
    if (Array.isArray(val)) return val.map(serializeBigInt);
    if (val && typeof val === "object") return Object.fromEntries(Object.entries(val).map(([k, v]) => [k, serializeBigInt(v)]));
    return val;
  };

  return { status: 200, message: "Quiz questions added successfully", data: serializeBigInt(createdQuestions) };
};

export const getAllReadingPlans = async (data) => {
  const { category, page = 1, pageSize = 10 } = data;
  const pageNum = parseInt(page) || 1;
  const pageSizeNum = Math.min(parseInt(pageSize) || 10, 50);
  const offset = (pageNum - 1) * pageSizeNum;

  const whereClause = { isActive: true };
  if (category) whereClause.category = category;

  const [plans, totalCount] = await Promise.all([
    prisma.readingPlan.findMany({ where: whereClause, skip: offset, take: pageSizeNum, orderBy: { createdOn: "desc" } }),
    prisma.readingPlan.count({ where: whereClause }),
  ]);

  const serializeBigInt = (val) => {
    if (typeof val === "bigint") return Number(val);
    if (Array.isArray(val)) return val.map(serializeBigInt);
    if (val && typeof val === "object") return Object.fromEntries(Object.entries(val).map(([k, v]) => [k, serializeBigInt(v)]));
    return val;
  };

  const totalPages = Math.ceil(totalCount / pageSizeNum);
  return { status: 200, message: "Reading plans fetched successfully", data: serializeBigInt({ plans, totalCount, page: pageNum, pageSize: pageSizeNum, totalPages }) };
};

export const getPlansByCategory = async (data) => {
  const { category } = data;
  if (!category) return { status: 400, message: "Category is required" };

  const plans = await prisma.readingPlan.findMany({ where: { category, isActive: true }, orderBy: { createdOn: "desc" } });
  return { status: 200, message: "Reading plans fetched successfully", data: plans };
};

export const startReadingPlan = async (data, userId) => {
  const { planId } = data;
  if (!planId) return { status: 400, message: "Plan ID is required" };

  const plan = await prisma.readingPlan.findUnique({ where: { planId } });
  if (!plan) return { status: 404, message: "Reading plan not found" };

  const existingProgress = await prisma.userPlanProgress.findUnique({ where: { userId_planId: { userId, planId } } });
  if (existingProgress) return { status: 400, message: "You have already started this plan" };

  const progress = await prisma.userPlanProgress.create({
    data: { userId, planId, startDate: new Date(), completedDaysJson: "[]", streak: 0, isCompleted: false, createdBy: userId },
  });

  const serializeBigInt = (val) => {
    if (val === null || val === undefined) return val;
    if (typeof val === "bigint") return Number(val);
    if (Array.isArray(val)) return val.map(serializeBigInt);
    if (val && typeof val === "object") {
      return Object.fromEntries(Object.entries(val).map(([k, v]) => [k, serializeBigInt(v)]));
    }
    return val;
  };

  return { status: 200, message: "Reading plan started successfully", data: serializeBigInt(progress) };
};

export const getUserProgress = async (userId) => {
  const progress = await prisma.userPlanProgress.findMany({ where: { userId }, include: { readingPlan: true }, orderBy: { startDate: "desc" } });
  return { status: 200, message: "User progress fetched successfully", data: progress };
};

export const getUserPlans = async (userId) => {
  const userPlans = await prisma.userPlanProgress.findMany({
    where: { userId },
    include: { readingPlan: true },
    orderBy: { startDate: "desc" }
  });

  const serializeBigInt = (val) => {
    if (val === null || val === undefined) return val;
    if (typeof val === "bigint") return Number(val);
    if (Array.isArray(val)) return val.map(serializeBigInt);
    if (val && typeof val === "object") {
      return Object.fromEntries(Object.entries(val).map(([k, v]) => [k, serializeBigInt(v)]));
    }
    return val;
  };

  const plans = userPlans.map((up) => {
    const completedDays = up.completedDaysJson ? JSON.parse(up.completedDaysJson) : [];
    return {
      planId: up.readingPlan.planId,
      planName: up.readingPlan.title,
      description: up.readingPlan.description,
      totalDays: up.readingPlan.totalDays,
      startDate: up.startDate,
      endDate: up.endDate,
      completedDays: completedDays.length,
      isCompleted: up.isCompleted,
      streak: up.streak,
    };
  });

  return { status: 200, message: "User plans fetched successfully", data: plans };
};

export const getUserPlanProgress = async (data, userId) => {
  const { planId } = data;
  if (!planId) return { status: 400, message: "Plan ID is required" };

  const progress = await prisma.userPlanProgress.findUnique({ where: { userId_planId: { userId, planId } }, include: { readingPlan: true } });
  if (!progress) return { status: 404, message: "No progress found for this plan" };

  return { status: 200, message: "Plan progress fetched successfully", data: progress };
};

export const getDailyAssignment = async (data) => {
  const { planId, dayNumber } = data;
  if (!planId || !dayNumber) return { status: 400, message: "Plan ID and day number are required" };

  const assignment = await prisma.dailyAssignment.findFirst({ where: { planId, dayNumber } });
  if (!assignment) return { status: 404, message: "No assignment found for this day" };

  const serializeBigInt = (val) => {
    if (typeof val === "bigint") return Number(val);
    if (Array.isArray(val)) return val.map(serializeBigInt);
    if (val && typeof val === "object") return Object.fromEntries(Object.entries(val).map(([k, v]) => [k, serializeBigInt(v)]));
    return val;
  };

  // Fetch quiz questions for this day
  const quizQuestions = await prisma.quizQuestion.findMany({ where: { planId, dayNumber } });
  const questionsWithoutAnswer = quizQuestions.map(({ correctAnswer, ...q }) => ({
    ...q,
    options: q.optionsJson ? JSON.parse(q.optionsJson) : [],
  }));

  const parsed = {
    ...assignment,
    chapters: assignment.chaptersJson ? JSON.parse(assignment.chaptersJson) : [],
    reflectionQuestions: assignment.reflectionQuestions ? JSON.parse(assignment.reflectionQuestions) : [],
    quizQuestions: serializeBigInt(questionsWithoutAnswer),
  };
  return { status: 200, message: "Daily assignment fetched successfully", data: serializeBigInt(parsed) };
};

export const getAllDailyAssignments = async (data) => {
  const { planId } = data;
  if (!planId) return { status: 400, message: "Plan ID is required" };

  const assignments = await prisma.dailyAssignment.findMany({ where: { planId }, orderBy: { dayNumber: "asc" } });
  return { status: 200, message: "All assignments fetched successfully", data: assignments };
};

export const markDayCompleted = async (data, userId) => {
  const { planId, dayNumber } = data;
  if (!planId || !dayNumber) return { status: 400, message: "Plan ID and day number are required" };

  const progress = await prisma.userPlanProgress.findUnique({ where: { userId_planId: { userId, planId } } });
  if (!progress) return { status: 404, message: "You have not started this plan" };

  const completedDays = progress.completedDaysJson ? JSON.parse(progress.completedDaysJson) : [];
  if (completedDays.includes(dayNumber)) return { status: 400, message: "This day is already completed" };

  completedDays.push(dayNumber);
  const plan = await prisma.readingPlan.findUnique({ where: { planId } });
  const isCompleted = completedDays.length >= plan.totalDays;

  const today = new Date();
  let newStreak = progress.streak;
  if (progress.lastCompletedDate) {
    const lastDate = new Date(progress.lastCompletedDate);
    const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) newStreak += 1;
    else if (diffDays > 1) newStreak = 1;
  } else {
    newStreak = 1;
  }

  const updatedProgress = await prisma.userPlanProgress.update({
    where: { id: progress.id },
    data: { completedDaysJson: JSON.stringify(completedDays), lastCompletedDate: today, streak: newStreak, isCompleted, completedDate: isCompleted ? today : null },
  });

  const serializeBigInt = (val) => {
    if (val === null || val === undefined) return val;
    if (typeof val === "bigint") return Number(val);
    if (Array.isArray(val)) return val.map(serializeBigInt);
    if (val && typeof val === "object") {
      return Object.fromEntries(Object.entries(val).map(([k, v]) => [k, serializeBigInt(v)]));
    }
    return val;
  };

  return { status: 200, message: "Day marked as completed", data: serializeBigInt(updatedProgress) };
};

export const submitQuizAnswer = async (data, userId) => {
  const { planId, dayNumber, questionId, userAnswer } = data;
  if (!planId || !dayNumber || !questionId || userAnswer === undefined) return { status: 400, message: "planId, dayNumber, questionId, and userAnswer are required" };

  const question = await prisma.quizQuestion.findUnique({ where: { id: BigInt(questionId) } });
  if (!question) return { status: 404, message: "Quiz question not found" };

  const isCorrect = question.correctAnswer === userAnswer;
  const existingAnswer = await prisma.userQuizAnswer.findUnique({ where: { userId_questionId: { userId, questionId: BigInt(questionId) } } });

  let answer;
  if (existingAnswer) {
    answer = await prisma.userQuizAnswer.update({ where: { id: existingAnswer.id }, data: { userAnswer, isCorrect, numberAttempt: (existingAnswer.numberAttempt || 0) + 1 } });
  } else {
    answer = await prisma.userQuizAnswer.create({ data: { userId, planId, dayNumber, questionId: BigInt(questionId), userAnswer, isCorrect, numberAttempt: 1 } });
  }

  return { status: 200, message: "Quiz answer submitted", data: { ...answer, isCorrect } };
};

export const getQuizQuestions = async (data) => {
  const { planId, dayNumber } = data;
  if (!planId || !dayNumber) return { status: 400, message: "Plan ID and day number are required" };

  const questions = await prisma.quizQuestion.findMany({ where: { planId, dayNumber } });
  const questionsWithoutAnswer = questions.map(({ correctAnswer, ...q }) => q);

  const serializeBigInt = (val) => {
    if (typeof val === "bigint") return Number(val);
    if (Array.isArray(val)) return val.map(serializeBigInt);
    if (val && typeof val === "object") return Object.fromEntries(Object.entries(val).map(([k, v]) => [k, serializeBigInt(v)]));
    return val;
  };

  return { status: 200, message: "Quiz questions fetched successfully", data: serializeBigInt(questionsWithoutAnswer) };
};

export const getQuizStatistics = async (data, userId) => {
  const { planId } = data;
  if (!planId) return { status: 400, message: "Plan ID is required" };

  const answers = await prisma.userQuizAnswer.findMany({ where: { userId, planId } });
  const totalQuestions = answers.length;
  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return { status: 200, message: "Quiz statistics fetched successfully", data: { totalQuestions, correctAnswers, accuracy, answers } };
};

export const updateReadingPlan = async (data, userId) => {
  const { planId, title, description, totalDays, questionsEnabled, category, difficulty, isActive } = data;
  if (!planId) return { status: 400, message: "Plan ID is required" };

  const updateData = {};
  if (title) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (totalDays) updateData.totalDays = totalDays;
  if (questionsEnabled !== undefined) updateData.questionsEnabled = questionsEnabled;
  if (category !== undefined) updateData.category = category;
  if (difficulty !== undefined) updateData.difficulty = difficulty;
  if (isActive !== undefined) updateData.isActive = isActive;
  updateData.updatedOn = new Date();
  updateData.updatedBy = userId;

  const plan = await prisma.readingPlan.update({ where: { planId }, data: updateData });

  const serializeBigInt = (val) => {
    if (typeof val === "bigint") return Number(val);
    if (Array.isArray(val)) return val.map(serializeBigInt);
    if (val && typeof val === "object") return Object.fromEntries(Object.entries(val).map(([k, v]) => [k, serializeBigInt(v)]));
    return val;
  };

  return { status: 200, message: "Reading plan updated successfully", data: serializeBigInt(plan) };
};

export const updateQuizQuestion = async (data, userId) => {
  const { questionId, question, options, correctAnswer, explanation } = data;
  if (!questionId) return { status: 400, message: "Question ID is required" };

  const updateData = {};
  if (question) updateData.question = question;
  if (options) updateData.optionsJson = JSON.stringify(options);
  if (correctAnswer !== undefined) updateData.correctAnswer = correctAnswer;
  if (explanation !== undefined) updateData.explanation = explanation;
  updateData.updatedOn = new Date();
  updateData.updatedBy = userId;

  const updatedQuestion = await prisma.quizQuestion.update({ where: { id: BigInt(questionId) }, data: updateData });

  const serializeBigInt = (val) => {
    if (typeof val === "bigint") return Number(val);
    if (Array.isArray(val)) return val.map(serializeBigInt);
    if (val && typeof val === "object") return Object.fromEntries(Object.entries(val).map(([k, v]) => [k, serializeBigInt(v)]));
    return val;
  };

  return { status: 200, message: "Quiz question updated successfully", data: serializeBigInt(updatedQuestion) };
};

export const deleteQuizQuestion = async (data) => {
  const { questionId } = data;
  if (!questionId) return { status: 400, message: "Question ID is required" };

  await prisma.quizQuestion.delete({ where: { id: BigInt(questionId) } });
  return { status: 200, message: "Quiz question deleted successfully" };
};

export const updateDailyAssignment = async (data, userId) => {
  const { assignmentId, title, chapters, reflectionQuestions } = data;
  if (!assignmentId) return { status: 400, message: "Assignment ID is required" };

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (chapters) updateData.chaptersJson = JSON.stringify(chapters);
  if (reflectionQuestions !== undefined) updateData.reflectionQuestions = reflectionQuestions ? JSON.stringify(reflectionQuestions) : null;
  updateData.updatedOn = new Date();
  updateData.updatedBy = userId;

  const assignment = await prisma.dailyAssignment.update({ where: { id: BigInt(assignmentId) }, data: updateData });

  const serializeBigInt = (val) => {
    if (typeof val === "bigint") return Number(val);
    if (Array.isArray(val)) return val.map(serializeBigInt);
    if (val && typeof val === "object") return Object.fromEntries(Object.entries(val).map(([k, v]) => [k, serializeBigInt(v)]));
    return val;
  };

  return { status: 200, message: "Daily assignment updated successfully", data: serializeBigInt(assignment) };
};

export const getPlanDetail = async (data, userId = null) => {
  const { planId } = data;
  if (!planId) return { status: 400, message: "Plan ID is required" };

  const serializeBigInt = (val) => {
    if (typeof val === "bigint") return Number(val);
    if (Array.isArray(val)) return val.map(serializeBigInt);
    if (val && typeof val === "object") return Object.fromEntries(Object.entries(val).map(([k, v]) => [k, serializeBigInt(v)]));
    return val;
  };

  const plan = await prisma.readingPlan.findUnique({ where: { planId } });
  if (!plan) return { status: 404, message: "Reading plan not found" };

  const assignments = await prisma.dailyAssignment.findMany({ where: { planId }, orderBy: { dayNumber: "asc" } });
  const questions = await prisma.quizQuestion.findMany({ where: { planId } });

  let userProgress = null;
  let userQuizStats = null;

  if (userId) {
    userProgress = await prisma.userPlanProgress.findUnique({
      where: { userId_planId: { userId, planId } },
    });

    if (userProgress) {
      const userAnswers = await prisma.userQuizAnswer.findMany({
        where: { userId, planId },
      });

      const totalAnswered = userAnswers.length;
      const correctAnswers = userAnswers.filter((a) => a.isCorrect).length;
      const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;

      userQuizStats = {
        totalAnswered,
        correctAnswers,
        accuracy,
      };
    }
  }

  const completedDays = userProgress?.completedDaysJson ? JSON.parse(userProgress.completedDaysJson) : [];
  const completedDaysCount = completedDays.length;
  const totalDays = plan.totalDays;
  const completionPercentage = totalDays > 0 ? Math.round((completedDaysCount / totalDays) * 100) : 0;

  const daysSinceStarted = userProgress?.startDate
    ? Math.floor((new Date() - new Date(userProgress.startDate)) / (1000 * 60 * 60 * 24))
    : null;

  const daysSinceLastActivity = userProgress?.lastCompletedDate
    ? Math.floor((new Date() - new Date(userProgress.lastCompletedDate)) / (1000 * 60 * 60 * 24))
    : null;

  const isCompleted = userProgress?.isCompleted ?? false;
  const started = !!userProgress;

  const avgDaysPerCompletion = completedDaysCount > 0 && daysSinceStarted
    ? Math.round(daysSinceStarted / completedDaysCount)
    : null;

  const estimatedDaysToComplete = !isCompleted && completedDaysCount > 0
    ? totalDays - completedDaysCount
    : null;

  const assignmentsWithContent = assignments.map((a) => ({
    id: a.id,
    dayNumber: a.dayNumber,
    title: a.title,
    chapters: a.chaptersJson ? JSON.parse(a.chaptersJson) : [],
    reflectionQuestions: a.reflectionQuestions ? JSON.parse(a.reflectionQuestions) : [],
  }));

  const questionsByDay = questions.reduce((acc, q) => {
    if (!acc[q.dayNumber]) acc[q.dayNumber] = [];
    acc[q.dayNumber].push({
      id: q.id,
      question: q.question,
      options: q.optionsJson ? JSON.parse(q.optionsJson) : [],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    });
    return acc;
  }, {});

  const days = Array.from({ length: totalDays }, (_, i) => {
    const dayNum = i + 1;
    const assignment = assignmentsWithContent.find((a) => a.dayNumber === dayNum);
    return {
      dayNumber: dayNum,
      title: assignment?.title ?? "",
      chapters: assignment?.chapters ?? [],
      reflectionQuestions: assignment?.reflectionQuestions ?? [],
      quizQuestions: questionsByDay[dayNum] ?? [],
      exists: !!assignment,
    };
  });

  const response = {
    planId: plan.planId,
    plan_db_id: plan.id,
    title: plan.title,
    description: plan.description,
    category: plan.category,
    difficulty: plan.difficulty,
    total_days: totalDays,
    total_assignments: assignments.length,
    total_quiz_questions: questions.length,
    questions_enabled: plan.questionsEnabled,
    is_active: plan.isActive,
    plan_created_on: plan.createdOn,

    started,
    is_completed: isCompleted,
    completed_date: userProgress?.completedDate?.toISOString() ?? null,
    completion_percentage: completionPercentage,
    completed_days_count: completedDaysCount,
    completed_days_json: userProgress?.completedDaysJson ?? null,
    progress_id: userProgress?.id ?? null,
    user_id: userProgress?.userId ?? null,
    start_date: userProgress?.startDate?.toISOString() ?? null,
    last_completed_date: userProgress?.lastCompletedDate?.toISOString() ?? null,
    days_since_started: daysSinceStarted,
    days_since_last_activity: daysSinceLastActivity,
    estimated_days_to_complete: estimatedDaysToComplete,
    avg_days_per_completion: avgDaysPerCompletion,
    streak: userProgress?.streak ?? null,

    user_answered_questions: userQuizStats?.totalAnswered ?? 0,
    user_correct_answers: userQuizStats?.correctAnswers ?? 0,
    quiz_accuracy_percentage: userQuizStats?.accuracy ?? 0,

    days,
  };

  return { status: 200, message: "Plan detail fetched successfully", data: serializeBigInt(response) };
};

export const removeReadingPlan = async (data, userId) => {
  const { planId } = data;
  if (!planId) return { status: 400, message: "Plan ID is required" };

  const progress = await prisma.userPlanProgress.findUnique({ where: { userId_planId: { userId, planId } } });
  if (!progress) return { status: 404, message: "No progress found for this plan" };

  await prisma.userPlanProgress.delete({ where: { id: progress.id } });
  return { status: 200, message: "Reading plan removed successfully" };
};