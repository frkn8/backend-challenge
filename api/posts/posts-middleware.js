const checkPayload = (req, res, next) => {
  try {
    const { text } = req.body;


    if (text.length > 360) {
      res.status(400).json({ message: "Text cannot be more than 360 characters." });
    } else if (!text.length) {
      res.status(400).json({ message: "Text is required." });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};



module.exports = { checkPayload };