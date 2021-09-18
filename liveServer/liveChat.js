const ChatUser = require("../models/ChatUser");

const isSimilar = (a1, a2) => {
  if (a1.length !== a2.length) {
    return false;
  }
  return a1.every((item) => a2.some((item2) => item === item2));
};

const chatIo = (io) => {
  const rooms = new Map();
  const chat = {};
  io.on("connection", (socket) => {
    socket.on("ROOM:CHAT", ({ msg, email, id }) => {
      try {
        if (id) {
          chat[email] = id;
        } else {
          const emails = JSON.parse(email);
          emails.forEach(async (element) => {
            const candidate = await ChatUser.findOne({
              email: element,
            });
            const chatarr = JSON.parse(candidate.chatId);
            let payman = true;
            let newChatId = chatarr.map((item) => {
              if (isSimilar(item.emails, emails)) {
                payman = false;
                return { emails: item.emails, msg: [...item.msg, msg] };
              }
              return item;
            });
            if (payman) {
              newChatId = [...newChatId, { emails: emails, msg: [msg] }];
            }
            await ChatUser.updateOne(
              { email: element },
              { chatId: JSON.stringify(newChatId) }
            );
            await socket.to(chat[element]).emit("ROOM:CHAT", msg);
          });
        }
      } catch (error) {}
    });
  });
};

module.exports = chatIo;
