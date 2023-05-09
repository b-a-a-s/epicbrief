import {Client} from "@hubspot/api-client";
import cors from "cors";
import "dotenv/config";
import express, {Request, Response} from "express";
import * as functions from "firebase-functions";

const TOKEN = process.env.HUBSPOT_TOKEN || "";

const app = express();

app.use(cors({origin: true}));
app.use(express.json());

const assosiate = async (meeting: string, contact: string) => {
  const hubspotClient = new Client({accessToken: TOKEN});
  return hubspotClient.apiRequest({method: "put", path: `/crm/v3/objects/meetings/${meeting}/associations/contacts/${contact}/200`});
};

const deassosiate = async (meeting: string, contact: string) => {
  const hubspotClient = new Client({accessToken: TOKEN});
  return hubspotClient.apiRequest({method: "delete", path: `/crm/v3/objects/meetings/${meeting}/associations/contacts/${contact}/200`});
};

app.post("/", async (request: Request, response: Response) => {
  const body = request.body;
  const hubspotClient = new Client({accessToken: TOKEN});
  const data = await hubspotClient
      .apiRequest({
        method: "post",
        path: "/crm/v3/objects/meetings",
        body: {
          properties: {
            hs_meeting_title: body.name,
            hs_timestamp: new Date(body.time).getTime(),
            hs_meeting_start_time: new Date(body.time).getTime(),
            hs_internal_meeting_notes: body.notes,
            hs_meeting_outcome: body.notes ? "COMPLETED" : "SCHEDULED",
          },
          associations: [
            {
              to: {id: body.account},
              types: [{associationCategory: "HUBSPOT_DEFINED", associationTypeId: 200}],
            },
          ],
        },
      })
      .then((data) => console.log(data));
  return response.send({data});
});

app.patch("/:id", async (request: Request, response: Response) => {
  const body = request.body;
  const hubspotClient = new Client({accessToken: TOKEN});
  if (body.account && body.oldAccount && body.account !== body.oldAccount) {
    await deassosiate(request?.params?.id || "", body.oldAccount);
    await assosiate(request?.params?.id || "", body.account);
  }
  const data = await hubspotClient
      .apiRequest({
        method: "patch",
        path: `/crm/v3/objects/meetings/${request.params.id}`,
        body: {
          properties: {
            hs_meeting_title: body.name,
            hs_meeting_start_time: new Date(body.time).getTime(),
            hs_internal_meeting_notes: body.notes,
            hs_meeting_outcome: body.notes ? "COMPLETED" : "SCHEDULED",
          },
        },
      })
      .then((data) => console.log(data));
  return response.send({data});
});

app.get("/", async (_request: Request, response: Response) => {
  const LIMIT = "limit=100";
  const ASSOCIATIONS = "associations=contacts";
  const PROPERTIES = "properties=hs_meeting_title,hs_meeting_start_time,hs_meeting_outcome,hs_internal_meeting_notes";
  const hubspotClient = new Client({accessToken: TOKEN});
  const contacts = await hubspotClient.crm.contacts.getAll();
  const meetings = await hubspotClient
      .apiRequest({
        method: "get",
        path: `/crm/v3/objects/meetings?${LIMIT}&${ASSOCIATIONS}&${PROPERTIES}`,
      })
      .then((data) => data.json());
  return response.send({meetings: meetings.results, contacts});
});

app.get("/:id", async (request: Request, response: Response) => {
  const ASSOCIATIONS = "associations=contacts";
  const PROPERTIES = "properties=hs_meeting_title,hs_meeting_start_time,hs_meeting_outcome,hs_internal_meeting_notes";
  const hubspotClient = new Client({accessToken: TOKEN});
  const contacts = await hubspotClient.crm.contacts.getAll();
  const meeting = await hubspotClient
      .apiRequest({
        method: "get",
        path: `/crm/v3/objects/meeting/${request.params.id}?${ASSOCIATIONS}&${PROPERTIES}`,
      })
      .then((data) => data.json());
  return response.send({meeting: meeting, contacts});
});

app.put("/:id/contacts/:contactId", async (request: Request, response: Response) => {
  const id = request.params.id;
  const contactId = request.body.contactId;
  const hubspotClient = new Client({accessToken: TOKEN});
  if (!request.params.id) {
    return response.status(400).send({error: "No id provided"});
  }
  const data = hubspotClient
      .apiRequest({method: "put", path: `/crm/v3/objects/meetings/${id}/associations/contacts/${contactId}/200`})
      .then((data) => data.status);
  return response.send({statuses: data});
});

app.delete("/:id", async (request: Request, response: Response) => {
  const hubspotClient = new Client({accessToken: TOKEN});
  if (!request.params.id) {
    return response.status(400).send({error: "No id provided"});
  }
  const ids = request.params.id.split(",");
  const data = await Promise.all(
      ids.map((id: string) =>
        hubspotClient.apiRequest({method: "delete", path: `/crm/v3/objects/meetings/${id}`}).then((data) => data.status)
      )
  );
  return response.send({statuses: data});
});

exports.meetings = functions.https.onRequest(app);
