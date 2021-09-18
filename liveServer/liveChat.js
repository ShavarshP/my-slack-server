const chatIo = (io) => {
  const rooms = new Map();
  const chat = {};
  io.on("connection", (socket) => {
    socket.on("ROOM:CHAT", ({ msg, email, id }) => {
      if (id) {
        chat[email] = id;
      } else {
        const emails = JSON.parse(email);
        emails.forEach((element) => {
          socket.to(chat[element]).emit("ROOM:CHAT", msg);
        });
      }
    });
  });
};

module.exports = chatIo;
