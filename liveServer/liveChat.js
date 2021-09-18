const chatIo = (io) => {
  const rooms = new Map();
  io.on("connection", (socket) => {
    cardArr = cardsList.filter((item) => item.index > 4);
    socket.on("ROOM:JOIN", ({ roomId, userName }) => {});
  });
};
module.exports = chatIo;
