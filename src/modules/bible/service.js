import { prisma } from "../../config/db.js";

export const addHighlight = async (data, userId) => {
  const { bookName, chapter, verseNumber, verseNumbers, colorId, note } = data;

  if (!bookName || !chapter || !colorId) {
    return { status: 400, message: "bookName, chapter, and colorId are required" };
  }

  const verses = verseNumbers || (verseNumber ? [verseNumber] : []);
  if (verses.length === 0) return { status: 400, message: "verseNumber or verseNumbers is required" };

  const added = [];
  for (const v of verses) {
    try {
      const highlight = await prisma.highlight.create({
        data: {
          bookName,
          chapter: BigInt(chapter),
          verseNumber: BigInt(v),
          colorId: BigInt(colorId),
          note,
          createdBy: userId,
          createdOn: new Date(),
        },
      });
      added.push({
        id: Number(highlight.id),
        bookName: highlight.bookName,
        chapter: Number(highlight.chapter),
        verseNumber: Number(highlight.verseNumber),
        colorId: Number(highlight.colorId),
        note: highlight.note,
        createdBy: highlight.createdBy,
        createdOn: highlight.createdOn,
      });
    } catch (error) {
      if (error.code !== "P2002") throw error;
    }
  }

  return { status: 200, message: "Highlight added successfully", data: added };
};

export const getHighlights = async (data, userId) => {
  const { bookName, chapter, verseNumber, colorId, page = 1, pageSize = 20 } = data;
  const pageNum = parseInt(page) || 1;
  const pageSizeNum = Math.min(parseInt(pageSize) || 20, 50);
  const offset = (pageNum - 1) * pageSizeNum;

  const whereClause = { createdBy: userId };
  if (bookName) whereClause.bookName = bookName;
  if (chapter) whereClause.chapter = BigInt(chapter);
  if (verseNumber) whereClause.verseNumber = BigInt(verseNumber);
  if (colorId) whereClause.colorId = BigInt(colorId);

  const [highlights, totalCount] = await Promise.all([
    prisma.highlight.findMany({ where: whereClause, skip: offset, take: pageSizeNum, orderBy: { createdOn: "desc" } }),
    prisma.highlight.count({ where: whereClause }),
  ]);

  const serializedHighlights = highlights.map(h => ({
    id: Number(h.id),
    bookName: h.bookName,
    chapter: Number(h.chapter),
    verseNumber: Number(h.verseNumber),
    colorId: Number(h.colorId),
    note: h.note,
    createdBy: h.createdBy,
    createdOn: h.createdOn,
  }));

  const totalPages = Math.ceil(totalCount / pageSizeNum);
  return { status: 200, message: "Highlights fetched successfully", data: { highlights: serializedHighlights, totalCount, page: pageNum, pageSize: pageSizeNum, totalPages } };
};

export const deleteHighlight = async (data, userId) => {
  const { highlightId } = data;
  if (!highlightId) return { status: 400, message: "Highlight ID is required" };

  await prisma.highlight.delete({ where: { id: BigInt(highlightId), createdBy: userId } });
  return { status: 200, message: "Highlight deleted successfully" };
};

export const addReadHistory = async (data, userId) => {
  const { bookName, chapter, verseNumber } = data;
  if (!bookName || !chapter || !verseNumber) return { status: 400, message: "bookName, chapter, and verseNumber are required" };

  try {
    const readHistory = await prisma.readHistory.create({
      data: { bookName, chapter: BigInt(chapter), verseNumber: BigInt(verseNumber), createdBy: userId, createdOn: new Date() },
    });
    return {
      status: 200,
      message: "Read history added successfully",
      data: {
        id: Number(readHistory.id),
        bookName: readHistory.bookName,
        chapter: Number(readHistory.chapter),
        verseNumber: Number(readHistory.verseNumber),
        createdBy: readHistory.createdBy,
        createdOn: readHistory.createdOn,
      }
    };
  } catch (error) {
    if (error.code === "P2002") return { status: 400, message: "Read history already exists" };
    throw error;
  }
};

export const getReadHistory = async (data, userId) => {
  const { bookName, chapter, page = 1, pageSize = 20 } = data;
  const pageNum = parseInt(page) || 1;
  const pageSizeNum = Math.min(parseInt(pageSize) || 20, 50);
  const offset = (pageNum - 1) * pageSizeNum;

  const whereClause = { createdBy: userId };
  if (bookName) whereClause.bookName = bookName;
  if (chapter) whereClause.chapter = BigInt(chapter);

  const [readHistories, totalCount] = await Promise.all([
    prisma.readHistory.findMany({ where: whereClause, skip: offset, take: pageSizeNum, orderBy: { createdOn: "desc" } }),
    prisma.readHistory.count({ where: whereClause }),
  ]);

  const serialized = readHistories.map(h => ({
    id: Number(h.id),
    bookName: h.bookName,
    chapter: Number(h.chapter),
    verseNumber: Number(h.verseNumber),
    createdBy: h.createdBy,
    createdOn: h.createdOn,
  }));

  const totalPages = Math.ceil(totalCount / pageSizeNum);
  return { status: 200, message: "Read history fetched successfully", data: { readHistories: serialized, totalCount, page: pageNum, pageSize: pageSizeNum, totalPages } };
};

export const deleteReadHistory = async (data, userId) => {
  const { readHistoryIds } = data;
  if (!readHistoryIds || !Array.isArray(readHistoryIds)) return { status: 400, message: "Read history IDs are required" };

  await prisma.readHistory.deleteMany({ where: { id: { in: readHistoryIds.map(BigInt) }, createdBy: userId } });
  return { status: 200, message: "Read history deleted successfully" };
};

export const addFavorite = async (data, userId) => {
  const { bookName, chapter, verseNumber, verseNumbers } = data;
  if (!bookName || !chapter) return { status: 400, message: "bookName and chapter are required" };

  const verses = verseNumbers || (verseNumber ? [verseNumber] : []);
  if (verses.length === 0) return { status: 400, message: "verseNumber or verseNumbers is required" };

  const added = [];
  for (const v of verses) {
    try {
      const favorite = await prisma.favorite.create({
        data: { bookName, chapter: BigInt(chapter), verseNumber: BigInt(v), createdBy: userId, createdOn: new Date() },
      });
      added.push({
        id: Number(favorite.id),
        bookName: favorite.bookName,
        chapter: Number(favorite.chapter),
        verseNumber: Number(favorite.verseNumber),
        createdBy: favorite.createdBy,
        createdOn: favorite.createdOn,
      });
    } catch (error) {
      if (error.code !== "P2002") throw error;
    }
  }

  return { status: 200, message: "Favorite added successfully", data: added };
};

export const getFavorites = async (data, userId) => {
  const { bookName, chapter, page = 1, pageSize = 20 } = data;
  const pageNum = parseInt(page) || 1;
  const pageSizeNum = Math.min(parseInt(pageSize) || 20, 50);
  const offset = (pageNum - 1) * pageSizeNum;

  const whereClause = { createdBy: userId };
  if (bookName) whereClause.bookName = bookName;
  if (chapter) whereClause.chapter = BigInt(chapter);

  const [favorites, totalCount] = await Promise.all([
    prisma.favorite.findMany({ where: whereClause, skip: offset, take: pageSizeNum, orderBy: { createdOn: "desc" } }),
    prisma.favorite.count({ where: whereClause }),
  ]);

  const serialized = favorites.map(f => ({
    id: Number(f.id),
    bookName: f.bookName,
    chapter: Number(f.chapter),
    verseNumber: Number(f.verseNumber),
    createdBy: f.createdBy,
    createdOn: f.createdOn,
  }));

  const totalPages = Math.ceil(totalCount / pageSizeNum);
  return { status: 200, message: "Favorites fetched successfully", data: { favorites: serialized, totalCount, page: pageNum, pageSize: pageSizeNum, totalPages } };
};

export const deleteFavorite = async (data, userId) => {
  const { favoriteId } = data;
  if (!favoriteId) return { status: 400, message: "Favorite ID is required" };

  await prisma.favorite.delete({ where: { id: BigInt(favoriteId), createdBy: userId } });
  return { status: 200, message: "Favorite deleted successfully" };
};

export const getVerseExplanation = async (data) => {
  const { bookName, chapter, verseNumber } = data;
  if (!bookName || !chapter || !verseNumber) return { status: 400, message: "bookName, chapter, and verseNumber are required" };

  const explanation = await prisma.verseExplanation.findUnique({
    where: { bookName_chapter_verseNumber: { bookName, chapter: BigInt(chapter), verseNumber: BigInt(verseNumber) } },
  });

  if (!explanation) return { status: 404, message: "Verse explanation not found" };

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

  return { status: 200, message: "Verse explanation fetched successfully", data: serializeBigInt(explanation) };
};

export const addVerseExplanation = async (data, userId) => {
  const { bookName, chapter, verseNumber, explanation, learnMore, bibleVersion, id } = data;
  if (!bookName || !chapter || !verseNumber) return { status: 400, message: "bookName, chapter, and verseNumber are required" };

  let verseExplanation;
  if (id) {
    verseExplanation = await prisma.verseExplanation.update({
      where: { id: BigInt(id) },
      data: { bookName, chapter: BigInt(chapter), verseNumber: BigInt(verseNumber), explanation, learnMore, bibleVersion, updatedBy: userId },
    });
  } else {
    verseExplanation = await prisma.verseExplanation.upsert({
      where: { bookName_chapter_verseNumber: { bookName, chapter: BigInt(chapter), verseNumber: BigInt(verseNumber) } },
      update: { explanation, learnMore, bibleVersion, updatedBy: userId },
      create: { bookName, chapter: BigInt(chapter), verseNumber: BigInt(verseNumber), explanation, learnMore, bibleVersion, createdBy: userId },
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

  const msg = id ? "Verse explanation updated successfully" : "Verse explanation added successfully";
  return { status: 200, message: msg, data: serializeBigInt(verseExplanation) };
};

export const getAllVersesExplanation = async (data) => {
  const { page = 1, pageSize = 20, bookName } = data;
  const pageNum = parseInt(page) || 1;
  const pageSizeNum = Math.min(parseInt(pageSize) || 20, 50);
  const offset = (pageNum - 1) * pageSizeNum;

  const whereClause = {};
  if (bookName) whereClause.bookName = bookName;

  const [explanations, totalCount] = await Promise.all([
    prisma.verseExplanation.findMany({ where: whereClause, skip: offset, take: pageSizeNum, orderBy: { bookName: "asc" } }),
    prisma.verseExplanation.count({ where: whereClause }),
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

  const totalPages = Math.ceil(totalCount / pageSizeNum);
  return { status: 200, message: "Verse explanations fetched successfully", data: serializeBigInt({ explanations, totalCount, page: pageNum, pageSize: pageSizeNum, totalPages }) };
};

export const addVerseNote = async (data, userId) => {
  const { bookName, chapter, verseNumber, verseNumbers, note } = data;
  if (!bookName || !chapter || !note) return { status: 400, message: "bookName, chapter, and note are required" };

  const verses = verseNumbers || (verseNumber ? [verseNumber] : []);
  if (verses.length === 0) return { status: 400, message: "verseNumber or verseNumbers is required" };

  const added = [];
  for (const v of verses) {
    try {
      const verseNote = await prisma.note.create({
        data: { bookName, chapter: BigInt(chapter), verseNumber: BigInt(v), note, createdBy: userId, createdOn: new Date() },
      });
      added.push({
        id: Number(verseNote.id),
        bookName: verseNote.bookName,
        chapter: Number(verseNote.chapter),
        verseNumber: Number(verseNote.verseNumber),
        note: verseNote.note,
        createdBy: verseNote.createdBy,
        createdOn: verseNote.createdOn,
      });
    } catch (error) {
      if (error.code !== "P2002") throw error;
    }
  }

  return { status: 200, message: "Verse note added successfully", data: added };
};

export const getVerseNote = async (data, userId) => {
  const whereClause = { createdBy: userId };
  if (data.bookName) whereClause.bookName = data.bookName;
  if (data.chapter) whereClause.chapter = BigInt(data.chapter);
  if (data.verseNumber) whereClause.verseNumber = BigInt(data.verseNumber);

  const notes = await prisma.note.findMany({ where: whereClause, orderBy: { createdOn: "desc" } });
  const serializedNotes = notes.map(n => ({
    id: Number(n.id),
    bookName: n.bookName,
    chapter: Number(n.chapter),
    verseNumber: Number(n.verseNumber),
    note: n.note,
    createdBy: n.createdBy,
    createdOn: n.createdOn,
  }));
  return { status: 200, message: "Verse notes fetched successfully", data: serializedNotes };
};

export const deleteVerseNote = async (data, userId) => {
  const { noteId } = data;
  if (!noteId) return { status: 400, message: "Note ID is required" };

  await prisma.note.delete({ where: { id: BigInt(noteId), createdBy: userId } });
  return { status: 200, message: "Verse note deleted successfully" };
};

export const getTodaysVerse = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let dailyVerse = await prisma.dailyVerse.findFirst({
    where: { displayDate: { gte: today }, isPublished: true },
    orderBy: { displayDate: "asc" },
  });

  if (!dailyVerse) {
    dailyVerse = await prisma.dailyVerse.findFirst({
      where: { isPublished: true },
      orderBy: { displayDate: "desc" },
    });
  }

  if (!dailyVerse) return { status: 404, message: "No daily verse found for today" };

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

  return { status: 200, message: "Today's verse fetched successfully", data: serializeBigInt(dailyVerse) };
};

export const getHomeStats = async (userId) => {
  const [highlightCount, favoriteCount, noteCount, readHistoryCount, planProgressCount] = await Promise.all([
    prisma.highlight.count({ where: { createdBy: userId } }),
    prisma.favorite.count({ where: { createdBy: userId } }),
    prisma.note.count({ where: { createdBy: userId } }),
    prisma.readHistory.count({ where: { createdBy: userId } }),
    prisma.userPlanProgress.count({ where: { userId } }),
  ]);

  return { status: 200, message: "Home stats fetched successfully", data: { highlightCount, favoriteCount, noteCount, readHistoryCount, planProgressCount } };
};

export const getRecentActivity = async (userId, limit = 10) => {
  const limitNum = Math.min(parseInt(limit) || 10, 20);

  const [recentReads, recentHighlights, recentNotes, recentFavorites, planProgress] = await Promise.all([
    prisma.readHistory.findMany({
      where: { createdBy: userId },
      take: limitNum,
      orderBy: { createdOn: "desc" },
    }),
    prisma.highlight.findMany({
      where: { createdBy: userId },
      take: limitNum,
      orderBy: { createdOn: "desc" },
    }),
    prisma.note.findMany({
      where: { createdBy: userId },
      take: limitNum,
      orderBy: { createdOn: "desc" },
    }),
    prisma.favorite.findMany({
      where: { createdBy: userId },
      take: limitNum,
      orderBy: { createdOn: "desc" },
    }),
    prisma.userPlanProgress.findMany({
      where: { userId },
      include: { readingPlan: true },
      orderBy: { lastCompletedDate: "desc" },
      take: 3,
    }),
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

  const allActivities = [
    ...recentReads.map((r) => ({
      type: "read",
      id: r.id,
      book: r.bookName,
      chapter: Number(r.chapter),
      verse: Number(r.verseNumber),
      time: r.createdOn,
    })),
    ...recentHighlights.map((h) => ({
      type: "highlight",
      id: h.id,
      book: h.bookName,
      chapter: Number(h.chapter),
      verse: Number(h.verseNumber),
      colorId: Number(h.colorId),
      time: h.createdOn,
    })),
    ...recentNotes.map((n) => ({
      type: "note",
      id: n.id,
      book: n.bookName,
      chapter: Number(n.chapter),
      verse: Number(n.verseNumber),
      time: n.createdOn,
    })),
    ...recentFavorites.map((f) => ({
      type: "favorite",
      id: f.id,
      book: f.bookName,
      chapter: Number(f.chapter),
      verse: Number(f.verseNumber),
      time: f.createdOn,
    })),
    ...planProgress.map((p) => {
      const completedDays = p.completedDaysJson ? JSON.parse(p.completedDaysJson) : [];
      const lastCompleted = completedDays[completedDays.length - 1];
      return {
        type: "plan",
        id: p.id,
        book: p.readingPlan?.title || "Reading Plan",
        chapter: lastCompleted || 0,
        verse: completedDays.length,
        time: p.lastCompletedDate || p.startDate,
        planId: p.planId,
        isPlanCompleted: p.isCompleted,
      };
    }),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const seenBooks = new Set();
  const activities = [];
  
  for (const act of allActivities) {
    if (activities.length >= 3) break;
    
    if (act.type === 'plan') {
      activities.push(act);
    } else {
      const bookKey = act.book.toLowerCase();
      if (!seenBooks.has(bookKey)) {
        seenBooks.add(bookKey);
        activities.push(act);
      }
    }
  }

  return { status: 200, message: "Recent activity fetched successfully", data: serializeBigInt(activities) };
};

export const deleteVerseExplanation = async (data, userId) => {
  const { id } = data;
  if (!id) return { status: 400, message: "Explanation ID is required" };

  await prisma.verseExplanation.delete({ where: { id: BigInt(id) } });
  return { status: 200, message: "Verse explanation deleted successfully" };
}