export const redirectUrl = async (req, res) => {
  const { originalUrl } = req.originalUrlData;
  console.log(`Redirecting to: ${originalUrl}`);
  res.redirect(originalUrl);
}