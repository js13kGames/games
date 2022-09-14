var messages = [];

messages[0] = [];
messages[1] = [];
messages[2] = [];
messages[3] = [];
messages[4] = [];

/* Day 1, Stage 0 */
messages[0][0] = [
  { speaker: 'Otto', content: "Good morning! First day, right?", delay: 10 },
  { speaker: 'Otto', content: "I'm Otto, I'll be training you this week", delay: 30 },
  { speaker: 'Otto', content: "Let's get started", delay: 30 },
  { speaker: 'Otto', content: "Draw a line from the start node to the end node", delay: 30 }
];

/* Day 1, Stage 1 */
messages[0][1] = [
  { speaker: 'Otto', content: "Great! You're a natural" },
];

/* Day 1, Stage 2 */
messages[0][2] = [
  { speaker: 'Otto', content: "Make sure your line goes through any connecting nodes too" },
];

/* Day 1, Stage 4 */
messages[0][4] = [
  { speaker: 'Otto', content: "And watch out for the blocks" },
];

/* Day 1, Stage 5 */
messages[0][5] = [
  { speaker: 'Otto', content: "Last one for today, see you tomorrow" },
];

/* Day 2, Stage 0 */
messages[1][0] = [
  { speaker: 'Otto', content: "Alright, big day for you" },
  { speaker: 'Otto', content: "We're turning on your bottom screen", delay: 20 },
];

/* Day 2, Stage 1 */
messages[1][1] = [
  { speaker: 'Otto', content: "Don't worry, you got this" },
];

/* Day 2, Stage 3 */
messages[1][3] = [
  { speaker: 'Otto', content: "Hey, how are you doing?" },
  { speaker: 'Otto', content: "Hold 'Reply' to respond", delay: 10 },
  { speaker: 'Otto', content: "(If you want)", delay: 10, awaitReply: true, replyDelay: 100, replyMessage: { speaker: 'You', content: "Doing just fine" } },
  { speaker: 'Otto', content: "Hey, glad to hear it", delay: 20, condition: function(game) { return game.repliedToLastMessage; } },
  { speaker: 'Otto', content: "Alright, I'll leave you to it", delay: 20, condition: function(game) { return !game.repliedToLastMessage; } },
];

/* Day 3, Stage 0 */
messages[2][0] = [
  { speaker: 'Otto', content: "We're turning on scoring for you now" },
  { speaker: 'Otto', content: "The faster you go, the higher your score", delay: 20 },
  { speaker: 'Otto', content: "Don't let it freak you out, though, okay?", delay: 20 },
  { speaker: 'Otto', content: "You're doing just fine", delay: 20 }
];

/* Day 3, Stage 3 */
messages[2][3] = [
  { speaker: 'Otto', content: "Be honest" },
  { speaker: 'Otto', content: "Is the score kind of freaking you out?", delay: 20, awaitReply: true, replyDelay: 100, replyMessage: { speaker: 'You', content: "It's alright" } },
  { speaker: 'Otto', content: "Dang, you're a champ", delay: 20, condition: function(game) { return game.repliedToLastMessage; } },
  { speaker: 'Otto', content: "Well, don't let it freak you out if it is", delay: 20, condition: function(game) { return !game.repliedToLastMessage; } }
];

/* Day 3, Stage 5 */
messages[2][5] = [
  { speaker: 'ParaTec', content: "Your performance is unsatisfactory. Please try harder tomorrow.", condition: function(game) { return game.totalScore < 4500; } },
  { speaker: 'ParaTec', content: "We are pleased with your performance. You are a star member of the ParaTec family.", condition: function(game) { return game.totalScore >= 4500; } },
];

/* Day 4, Stage 3 */
messages[3][3] = [
  { speaker: 'Otto', content: "Hey, I know this is tough work" },
  { speaker: 'Otto', content: "But you're doing really well", delay: 20, awaitReply: true, replyDelay: 100, replyMessage: { speaker: 'You', content: "Thanks for everything, Otto" } },
  { speaker: 'Otto', content: "Aww, no problem", delay: 20, condition: function(game) { return game.repliedToLastMessage; } },
  { speaker: 'Otto', content: "You'll do great here", delay: 20, condition: function(game) { return !game.repliedToLastMessage; } }
];

/* Day 4, Stage 5 */
messages[3][5] = [
  { speaker: 'ParaTec', content: "Your performance is unsatisfactory. Please try harder tomorrow.", condition: function(game) { return game.totalScore < 10000; } },
  { speaker: 'ParaTec', content: "We are pleased with your performance. You are a star member of the ParaTec family.", condition: function(game) { return game.totalScore >= 10000; } },
];

/* Day 5, Stage 0 */
messages[4][0] = [
  { speaker: 'Otto', content: "Last day of your first week!" },
  { speaker: 'Otto', content: "Come grab a beer with us after work tonight", delay: 20, condition: function(game) { return game.replyCount > 2; } }
];

/* Day 5, Stage 5 */
messages[4][5] = [
  { speaker: 'ParaTec', content: "Your peformance has been adequate this week. Welcome to the ParaTec family.", condition: function(game) { return game.totalScore < 15000; } },
  { speaker: 'ParaTec', content: "Your performance has been exceptional this week. Welcome to the ParaTec family.", condition: function(game) { return game.totalScore >= 15000; } },
];
