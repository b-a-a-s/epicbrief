import * as functions from "firebase-functions";
import express, {Request, Response} from "express";
import cors from "cors";
import {Client} from "@hubspot/api-client";

const TOKEN = "pat-eu1-cf82e317-f47b-4cf7-b305-be8371c973cf";

const app = express();

app.use(cors({origin: true}));

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// app.get('/:id', (req, res) => res.send(Widgets.getById(req.params.id)));
// app.post('/', (req, res) => res.send(Widgets.create()));
// app.put('/:id', (req, res) =>
// res.send(Widgets.update(req.params.id, req.body)));
// app.delete('/:id', (req, res) => res.send(Widgets.delete(req.params.id)));
// app.get('/meetings', (request, response) => {
// functions.logger.info("Hello logs!", {structuredData: true});
// response.send("Hello from Firebase!");
// }
app.get("/", async (request: Request, response: Response) => {
  const LIMIT = "limit=100";
  const ASSOCIATIONS = "associations=contacts";
  const PROPERTIES =
    "properties=hs_meeting_title,hs_meeting_start_time,hs_meeting_outcome,hs_internal_meeting_notes";
  const hubspotClient = new Client({accessToken: TOKEN});
  const contacts = await hubspotClient.crm.contacts.getAll();
  const meetings = await hubspotClient
      .apiRequest({
        method: "get",
        path: `/crm/v3/objects/meetings?${LIMIT}&${ASSOCIATIONS}&${PROPERTIES}`,
      })
      .then((data) => data.json());
  // functions.logger.info("Hello logs!", {structuredData: true});
  // response.send("Hello from Fireba);
  // send meetings and contacts as json
  response.send({meetings: meetings.results, contacts});
});

exports.meetings = functions.https.onRequest(app);
