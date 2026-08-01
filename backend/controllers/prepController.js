const InterviewPrep = require('../models/InterviewPrep');
const Event = require('../models/Event');

// Curated fallback repository
const EXPANDED_BANK = {
  Google: [
    {
      category: 'Coding & DSA',
      question: 'Find the median of two sorted arrays of size N and M in O(log(min(N,M))) time.',
      answerKey: 'Binary search on partition index of smaller array. Match max(LeftA, LeftB) <= min(RightA, RightB).'
    },
    {
      category: 'System Design',
      question: 'Design Google Drive / Distributed File Storage with chunking & deduplication.',
      answerKey: 'Chunk files into 4MB blocks, hash SHA-256 for deduplication, store metadata in Spanner/NoSQL, blobs in S3/GCS.'
    },
    {
      category: 'Technical',
      question: 'Explain garbage collection algorithms in V8 Engine (Scavenger & Mark-Sweep-Compact).',
      answerKey: 'Young generation uses Cheney Scavenger (Copying GC). Old generation uses Mark-Sweep-Compact to prevent fragmentation.'
    },
    {
      category: 'HR & Behavioral',
      question: 'Tell me about a project where you solved an ambiguous problem with no clear solution.',
      answerKey: 'Use STAR format: Break down problem into hypotheses, gather telemetry data, iterate rapidly, and measure impact.'
    }
  ],
  Amazon: [
    {
      category: 'Coding & DSA',
      question: 'Implement LRU (Least Recently Used) Cache with O(1) time complexity for get and put.',
      answerKey: 'Combine Doubly Linked List with Hash Map. HashMap stores key -> LinkedList Node for O(1) removal & promotion to head.'
    },
    {
      category: 'Coding & DSA',
      question: 'Word Ladder I: Find shortest transformation sequence length from beginWord to endWord.',
      answerKey: 'Use Breadth-First Search (BFS) level-by-level traversal. Replace each character with a-z to find neighbors.'
    },
    {
      category: 'HR & Behavioral',
      question: 'Give an example of Amazon Leadership Principle: "Customer Obsession" or "Ownership".',
      answerKey: 'Detail how you prioritized user experience over quick technical debt, resulting in reduced customer churn.'
    }
  ],
  Generic: [
    {
      category: 'Technical',
      question: 'Explain REST API Best Practices, HTTP Methods (GET, POST, PUT, DELETE), and Status Codes.',
      answerKey: 'Use noun URLs (/api/applications), stateless auth via JWT, proper error payloads, and idempotent PUT/DELETE methods.'
    },
    {
      category: 'Coding & DSA',
      question: 'Two Sum & Three Sum Problems: How to optimize from O(N^3) to O(N log N) / O(N).',
      answerKey: 'Two Sum uses Hash Map for O(N). Three Sum sorts array first then uses two pointers approach in O(N^2).'
    }
  ]
};

exports.generateQuestions = async (req, res) => {
  try {
    const { company, role } = req.query;
    const targetCompany = company || 'Tech Company';
    const targetRole = role || 'Software Engineer';

    const openRouterKey = process.env.OPENROUTER_API_KEY;

    if (openRouterKey) {
      try {
        const prompt = `You are a senior technical interviewer for ${targetCompany}.
Generate 5 high-quality, realistic interview questions for a ${targetRole} position.
Include a mix of Technical, System Design, Coding & DSA, and HR & Behavioral questions.

CRITICAL: Return ONLY a raw JSON array of objects without any markdown formatting or commentary.
Keys for each object:
- "category": string ('Coding & DSA', 'System Design', 'Technical', or 'HR & Behavioral')
- "question": string
- "answerKey": string (Provide 3 to 4 clear, well-punctuated sentences detailing the Core Approach, Implementation Steps, Edge Cases, and Time/Space Complexity)

Example format:
[
  {
    "category": "Coding & DSA",
    "question": "Sample Question?",
    "answerKey": "Use Quickselect for expected O(N) time. Partition around a random pivot. Handle duplicates using three-way partitioning. Time complexity: O(N) average, Space: O(1)."
  }
]`;

        // Try free tier openrouter models
        const freeModels = ['openrouter/free', 'openrouter/auto'];

        for (const modelName of freeModels) {
          try {
            const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openRouterKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'PlacementPrepPortal'
              },
              body: JSON.stringify({
                model: modelName,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7
              })
            });

            if (openRouterRes.ok) {
              const data = await openRouterRes.json();
              if (data.choices && data.choices[0] && data.choices[0].message) {
                const responseText = data.choices[0].message.content.trim();
                const jsonMatch = responseText.match(/\[\s*\{[\s\S]*\}\s*\]/);
                const cleanedJson = jsonMatch ? jsonMatch[0] : responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
                const aiQuestions = JSON.parse(cleanedJson);

                if (Array.isArray(aiQuestions) && aiQuestions.length > 0) {
                  return res.json({
                    company: targetCompany,
                    role: targetRole,
                    source: `OpenRouter Free (${modelName})`,
                    questions: aiQuestions
                  });
                }
              }
            }
          } catch (modelErr) {
            console.error(`Model ${modelName} error:`, modelErr.message);
          }
        }
      } catch (openRouterErr) {
        console.error('OpenRouter AI call error:', openRouterErr.message);
      }
    }

    // Fallback Repository
    const companyKey = EXPANDED_BANK[targetCompany] ? targetCompany : 'Generic';
    let questions = [...(EXPANDED_BANK[companyKey] || EXPANDED_BANK['Generic'])];
    if (companyKey !== 'Generic') {
      questions = [...questions, ...EXPANDED_BANK['Generic']];
    }

    res.json({
      company: targetCompany,
      role: targetRole,
      source: 'Placement Prep Engine',
      questions
    });
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ message: 'Server error generating interview questions' });
  }
};

exports.getBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookmarks = await InterviewPrep.find({ userId }).sort({ createdAt: -1 });
    res.json({ bookmarks });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ message: 'Server error fetching bookmarks' });
  }
};

exports.saveBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { companyName, role, category, question, answerKey } = req.body;

    const prep = await InterviewPrep.create({
      userId,
      companyName: companyName || 'General',
      role: role || 'Software Developer',
      category: category || 'Technical',
      question,
      answerKey,
      isBookmarked: true
    });

    res.status(201).json({ message: 'Question saved to prep notebook', prep });
  } catch (error) {
    console.error('Error saving bookmark:', error);
    res.status(500).json({ message: 'Server error saving question' });
  }
};

// Calendar Event Handlers
exports.getEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await Event.find({ userId }).sort({ eventDate: 1 });
    res.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error fetching events' });
  }
};

exports.addEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, companyName, eventType, eventDate, time, notes } = req.body;

    if (!title || !companyName || !eventDate) {
      return res.status(400).json({ message: 'Title, Company Name, and Event Date are required' });
    }

    const newEvent = await Event.create({
      userId,
      title: title.trim(),
      companyName: companyName.trim(),
      eventType: eventType || 'Technical Interview',
      eventDate: eventDate.trim(),
      time: time || '10:00 AM',
      notes: notes ? notes.trim() : ''
    });

    res.status(201).json({ message: 'Event added to placement calendar', event: newEvent });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ message: 'Server error adding event' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const event = await Event.findOneAndDelete({ _id: id, userId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully', id });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Server error deleting event' });
  }
};
