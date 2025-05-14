const https = require("https");
const { https: followHttps } = require("follow-redirects");

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
        if (!json.success || !json.result?.url) {
          res.status(500).json({ error: "Invalid response structure from CKAN" });
          return;
        }

        const downloadUrl = json.result.url;

        followHttps.get(downloadUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0"
          }
        }, (fileResp) => {
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
