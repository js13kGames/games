scope.levelList = [];

// level 1
scope.levelList.push({
  time: 30,
  input: [
    "Documents",
    "Music",
    "Documents/Story.docx",
    "Never before.mp3",
    "Lady in red.mp3",
    "Recording 1.wav",
    "Thriller.docx",
    "Transactions Q4.pdf",
    "~Thriller.tmp",
  ],
  objectives: [
    {
      text: "Put all music in the Music folder",
      testFn: (files) => {
        {
          let subFiles = files.find((f) => f.name === "Music").files;
          let list = subFiles.filter((file) => {
            return ["wav", "mp3"].indexOf(file.extension) > -1;
          });
          if (list.length !== 3) return false;
        }
        return true;
      },
    },
    {
      text: "Put all docs in the Documents folder",
      testFn: (files) => {
        {
          let subFiles = files.find((f) => f.name === "Documents").files;
          let list = subFiles.filter((file) => {
            return ["docx", "doc", "pdf"].indexOf(file.extension) > -1;
          });
          if (list.length !== 3) return false;
        }
        return true;
      },
    },
    {
      text: "Remove all Temporary files",
      testFn: (files) => {
        {
          let subFiles = files.find((f) => f.name === "Recycle Bin").files;
          let list = subFiles.filter((file) => {
            return ["tmp"].indexOf(file.extension) > -1;
          });
          if (list.length !== 1) return false;
        }
        return true;
      },
    },
  ],
});

// level 2
scope.levelList.push({
  time: 40,
  input: [
    "Bank & Tax",
    "Music",
    "My Writings",
    "Books",
    "Imagine - John Lennon.mp3",
    "Lady in red.mp3",
    "Transactions Q4.pdf",
    "Recording 1.wav",
    "My Thriller.docx",
    "My Article for medium.docx",
    "Transactions Q2.pdf",
    "Transactions Q1.pdf",
    "~My Thriller.tmp",
    "~Pagefile.tmp",
    "Tax returns.pdf",
    "Tax rebate appl.pdf",
    "Sherlock Holmes by Arthu.pdf",
  ],
  objectives: [
    {
      text: "Put all music in the Music folder",
      testFn: (files) => {
        {
          let subFiles = files.find((f) => f.name === "Music").files;
          let list = subFiles.filter((file) => {
            return ["wav", "mp3"].indexOf(file.extension) > -1;
          });
          if (list.length !== 3) return false;
        }
        return true;
      },
    },
    {
      text: `Put all tax and bank related documents in the "Bank & Tax" folder`,
      testFn: (files) => {
        {
          let subFiles = files.find((f) => f.name === "Bank & Tax").files;
          let list = subFiles.filter((file) => {
            return (
              [
                "Transactions Q4.pdf",
                "Transactions Q2.pdf",
                "Transactions Q1.pdf",
                "Tax returns.pdf",
                "Tax rebate appl.pdf",
              ].indexOf(`${file.name}.${file.extension}`) > -1
            );
          });
          if (list.length !== 5) return false;
        }
        return true;
      },
    },
    {
      text: `Put only my literary works in the "My Writings" folder`,
      testFn: (files) => {
        {
          let subFiles = files.find((f) => f.name === "My Writings").files;
          let list = subFiles.filter((file) => {
            return (
              ["My Thriller.docx", "My Article for medium.docx"].indexOf(
                `${file.name}.${file.extension}`
              ) > -1
            );
          });
          if (list.length !== 2) return false;
        }
        return true;
      },
    },
    {
      text: `Put the book I'm reading in the "Books" folder`,
      testFn: (files) => {
        {
          let subFiles = files.find((f) => f.name === "Books").files;
          let list = subFiles.filter((file) => {
            return (
              ["Sherlock Holmes by Arthu.pdf"].indexOf(
                `${file.name}.${file.extension}`
              ) > -1
            );
          });
          if (list.length !== 1) return false;
        }
        return true;
      },
    },
    {
      text: "Remove all Temporary files",
      testFn: (files) => {
        {
          let subFiles = files.find((f) => f.name === "Recycle Bin").files;
          let list = subFiles.filter((file) => {
            return ["tmp"].indexOf(file.extension) > -1;
          });
          if (list.length !== 2) return false;
        }
        return true;
      },
    },
  ],
});


// level 3
scope.levelList.push({
  time: 25,
  input: [
    "Bank & Tax",
    "Music",
    "My Writings",
    "Books",
    "Smells Like Teen Spirit.mp3",
    "Billie Jean.mp3",
    "Like A Rolling Stone.mp3",
    "My Thriller.docx",
    "My Article for medium.docx",
    "Transactions Q2.pdf",
    "Transactions Q1.pdf",
    "~My Thriller.tmp",
    "~Pagefile.tmp",
    "Tax returns.pdf",
    "Tax rebate appl.pdf",
    "Sherlock Holmes by Arthu.pdf",
  ],
  objectives: [
    {
      text: "Put all music in the Music folder",
      testFn: (files) => {
        {
          let subFiles = files.find((f) => f.name === "Music").files;
          let list = subFiles.filter((file) => {
            return ["wav", "mp3"].indexOf(file.extension) > -1;
          });
          if (list.length !== 3) return false;
        }
        return true;
      },
    },
    {
      text: `Put all tax and bank related documents in the "Bank & Tax" folder`,
      testFn: (files) => {
        {
          let subFiles = files.find((f) => f.name === "Bank & Tax").files;
          let list = subFiles.filter((file) => {
            return (
              [
                "Transactions Q4.pdf",
                "Transactions Q2.pdf",
                "Transactions Q1.pdf",
                "Tax returns.pdf",
                "Tax rebate appl.pdf",
              ].indexOf(`${file.name}.${file.extension}`) > -1
            );
          });
          if (list.length !== 4) return false;
        }
        return true;
      },
    },
    {
      text: `Put only my literary works in the "My Writings" folder`,
      testFn: (files) => {
        {
          let subFiles = files.find((f) => f.name === "My Writings").files;
          let list = subFiles.filter((file) => {
            return (
              ["My Thriller.docx", "My Article for medium.docx"].indexOf(
                `${file.name}.${file.extension}`
              ) > -1
            );
          });
          if (list.length !== 2) return false;
        }
        return true;
      },
    },
    {
      text: `Put the book I'm reading in the "Books" folder`,
      testFn: (files) => {
        {
          let subFiles = files.find((f) => f.name === "Books").files;
          let list = subFiles.filter((file) => {
            return (
              ["Sherlock Holmes by Arthu.pdf"].indexOf(
                `${file.name}.${file.extension}`
              ) > -1
            );
          });
          if (list.length !== 1) return false;
        }
        return true;
      },
    },
    {
      text: "Remove all Temporary files",
      testFn: (files) => {
        {
          let subFiles = files.find((f) => f.name === "Recycle Bin").files;
          let list = subFiles.filter((file) => {
            return ["tmp"].indexOf(file.extension) > -1;
          });
          if (list.length !== 2) return false;
        }
        return true;
      },
    },
  ],
});
