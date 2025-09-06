const terms = {
  'developer_0': [
    [
      {
        "id" : "0",
        "term" : "Algorithm"
      },
      {
        "id" : "1",
        "term" : "Ajax"
      },
      {
        "id" : "2",
        "term" : "Source Code"
      },
      {
        "id" : "3",
        "term" : "JS"
      }
    ],
    [
      {
        "id" : "4",
        "term" : "IE7"
      },
      {
        "id" : "5",
        "term" : "CMS"
      },
      {
        "id" : "6",
        "term" : "Github"
      },
      {
        "id" : "7",
        "term" : "Builder"
      }
    ],
    [
      {
        "id" : "8",
        "term" : "Responsive"
      },
      {
        "id" : "9",
        "term" : "Desktop"
      },
      {
        "id" : "10",
        "term" : "MVC"
      },
      {
        "id" : "11",
        "term" : "Framework"
      }
    ],
    [
      {
        "id" : "12",
        "term" : "Boolean"
      },
      {
        "id" : "13",
        "term" : "Component"
      },
      {
        "id" : "14",
        "term" : "Test"
      },
      {
        "id" : "15",
        "term" : "Builder"
      }
    ]
  ],
  'Internet_1': [
    [
      {
        "id" : "0",
        "term" : "Ban"
      },
      {
        "id" : "1",
        "term" : "Cookie"
      },
      {
        "id" : "2",
        "term" : "Forum"
      },
      {
        "id" : "3",
        "term" : "Google"
      }
    ],
    [
      {
        "id" : "4",
        "term" : "Http"
      },
      {
        "id" : "5",
        "term" : "Email"
      },
      {
        "id" : "6",
        "term" : "SiteMap"
      },
      {
        "id" : "7",
        "term" : "Website"
      }
    ],
    [
      {
        "id" : "8",
        "term" : "Download"
      },
      {
        "id" : "9",
        "term" : "Whois"
      },
      {
        "id" : "10",
        "term" : "Webmaster"
      },
      {
        "id" : "11",
        "term" : "ECommerce"
      }
    ],
    [
      {
        "id" : "12",
        "term" : "Upload"
      },
      {
        "id" : "13",
        "term" : "SEO"
      },
      {
        "id" : "14",
        "term" : "Facebook"
      },
      {
        "id" : "15",
        "term" : "Bookmark"
      }
    ]
  ],
  'Meeting_2': [
    [
      {
        "id" : "0",
        "term" : "meeting"
      },
      {
        "id" : "1",
        "term" : "Brainstorming"
      },
      {
        "id" : "2",
        "term" : "Result"
      },
      {
        "id" : "3",
        "term" : "Agenda"
      }
    ],
    [
      {
        "id" : "4",
        "term" : "Diagram"
      },
      {
        "id" : "5",
        "term" : "Collaborator"
      },
      {
        "id" : "6",
        "term" : "Growth"
      },
      {
        "id" : "7",
        "term" : "Finance"
      }
    ],
    [
      {
        "id" : "8",
        "term" : "Fired"
      },
      {
        "id" : "9",
        "term" : "Hired"
      },
      {
        "id" : "10",
        "term" : "Videoconferencing"
      },
      {
        "id" : "11",
        "term" : "Fall"
      }
    ],
    [
      {
        "id" : "12",
        "term" : "Progress"
      },
      {
        "id" : "13",
        "term" : "Talk"
      },
      {
        "id" : "14",
        "term" : "Report"
      },
      {
        "id" : "15",
        "term" : "Leadership"
      }
    ]
  ]
}

io.on('connection', function (s) {
  s.on('room', function (data) {
    s.roomName = data.room;
    s.join(data.room);
    s.emit('terms', terms[data.room])
  });

  s.on('leave', function (data) {
    s.leave(data.room)
  });

  s.on('victory', function () {
    s.broadcast.to(s.roomName).emit('end')
  })
});