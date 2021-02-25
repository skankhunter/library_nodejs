module.exports = (req, res) => {
  res.status(404);
  res.render("error/404", { title: "Ошибка пути" });
};
