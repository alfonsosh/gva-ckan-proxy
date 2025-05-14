const https = require("https");

module.exports = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: "Missing resource ID" });
    return;
  }

  const ckanURL = `https://dadesobertes.gva.es/api/3/action/resource_show?id=${id}`;

  https.get(ckanURL, (resp) => {
    let data = "";
    resp.on("data", (chunk) => (data += chunk));
    resp.on("end", () => {
      try {
        const json = JSON.parse(data);
        const downloadUrl = json.result.url;

        https.get(downloadUrl, (fileResp) => {
          res.setHeader("Content-Type", fileResp.headers["content-type"] || "application/octet-stream");
          fileResp.pipe(res);
        }).on("error", () => {
          res.status(500).json({ error: "Error downloading file" });
        });
      } catch (e) {
        res.status(500).json({ error: "Error processing resource data" });
      }
    });
  }).on("error", () => {
    res.status(500).json({ error: "Error contacting CKAN API" });
  });
};
