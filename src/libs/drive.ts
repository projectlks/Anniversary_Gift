// import "server-only";

// import { Readable } from "node:stream";
// import { google, type drive_v3 } from "googleapis";

// export const DRIVE_ROOT_FOLDER_NAME = "Anniversary Space";
// export const DRIVE_IMAGE_FOLDER_NAME = "Images";
// export const DRIVE_MUSIC_FOLDER_NAME = "Music";

// const GOOGLE_DRIVE_FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";

// export type DriveClient = drive_v3.Drive;

// export type DriveUploadResult = {
//   id: string;
//   name: string;
//   webContentLink: string | null;
//   webViewLink: string | null;
//   driveLink: string;
// };

// function requireGoogleOAuthConfig() {
//   const clientId = process.env.GOOGLE_CLIENT_ID;
//   const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

//   if (!clientId || !clientSecret) {
//     throw new Error("Google OAuth env vars are missing.");
//   }

//   return { clientId, clientSecret };
// }

// function escapeDriveQueryValue(value: string) {
//   return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
// }

// function directDriveLink(fileId: string) {
//   return `https://drive.google.com/uc?export=download&id=${fileId}`;
// }

// export function initializeDriveClient(refreshToken: string): DriveClient {
//   if (!refreshToken) {
//     throw new Error("Google refresh token is missing.");
//   }

//   const { clientId, clientSecret } = requireGoogleOAuthConfig();
//   const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
//   oauth2Client.setCredentials({ refresh_token: refreshToken });

//   return google.drive({ version: "v3", auth: oauth2Client });
// }

// export async function getOrCreateFolder(
//   driveClient: DriveClient,
//   folderName: string,
// ) {
//   const query = [
//     `mimeType='${GOOGLE_DRIVE_FOLDER_MIME_TYPE}'`,
//     `name='${escapeDriveQueryValue(folderName)}'`,
//     "trashed=false",
//   ].join(" and ");

//   const existingFolder = await driveClient.files.list({
//     q: query,
//     fields: "files(id, name)",
//     pageSize: 1,
//     spaces: "drive",
//   });

//   const folderId = existingFolder.data.files?.[0]?.id;
//   if (folderId) return folderId;

//   const createdFolder = await driveClient.files.create({
//     requestBody: {
//       name: folderName,
//       mimeType: GOOGLE_DRIVE_FOLDER_MIME_TYPE,
//     },
//     fields: "id",
//   });

//   if (!createdFolder.data.id) {
//     throw new Error(`Failed to create Drive folder: ${folderName}`);
//   }

//   return createdFolder.data.id;
// }

// export async function getOrCreateSubFolder(
//   driveClient: DriveClient,
//   parentFolderId: string,
//   subFolderName: string,
// ) {
//   const query = [
//     `mimeType='${GOOGLE_DRIVE_FOLDER_MIME_TYPE}'`,
//     `name='${escapeDriveQueryValue(subFolderName)}'`,
//     `'${escapeDriveQueryValue(parentFolderId)}' in parents`,
//     "trashed=false",
//   ].join(" and ");

//   const existingFolder = await driveClient.files.list({
//     q: query,
//     fields: "files(id, name)",
//     pageSize: 1,
//     spaces: "drive",
//   });

//   const folderId = existingFolder.data.files?.[0]?.id;
//   if (folderId) return folderId;

//   const createdFolder = await driveClient.files.create({
//     requestBody: {
//       name: subFolderName,
//       mimeType: GOOGLE_DRIVE_FOLDER_MIME_TYPE,
//       parents: [parentFolderId],
//     },
//     fields: "id",
//   });

//   if (!createdFolder.data.id) {
//     throw new Error(`Failed to create Drive folder: ${subFolderName}`);
//   }

//   return createdFolder.data.id;
// }

// export async function uploadFileToDrive(
//   driveClient: DriveClient,
//   fileBuffer: Buffer,
//   fileName: string,
//   mimeType: string,
//   folderId: string,
// ): Promise<DriveUploadResult> {
//   const createdFile = await driveClient.files.create({
//     requestBody: {
//       name: fileName,
//       parents: [folderId],
//     },
//     media: {
//       mimeType,
//       body: Readable.from(fileBuffer),
//     },
//     fields: "id, name, webContentLink, webViewLink",
//   });

//   const fileId = createdFile.data.id;
//   if (!fileId) {
//     throw new Error("Google Drive did not return a file id.");
//   }

//   await driveClient.permissions.create({
//     fileId,
//     requestBody: {
//       role: "reader",
//       type: "anyone",
//     },
//   });

//   const publicFile = await driveClient.files.get({
//     fileId,
//     fields: "id, name, webContentLink, webViewLink",
//   });

//   const webContentLink = publicFile.data.webContentLink ?? null;
//   const webViewLink = publicFile.data.webViewLink ?? null;
//   const driveLink = webContentLink ?? webViewLink ?? directDriveLink(fileId);

//   return {
//     id: fileId,
//     name: publicFile.data.name ?? fileName,
//     webContentLink,
//     webViewLink,
//     driveLink,
//   };
// }


import "server-only";

import { Readable } from "node:stream";
import { google, type drive_v3 } from "googleapis";

export const DRIVE_ROOT_FOLDER_NAME = "Anniversary Space";
export const DRIVE_IMAGE_FOLDER_NAME = "Images";
export const DRIVE_MUSIC_FOLDER_NAME = "Music";

const GOOGLE_DRIVE_FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";

export type DriveClient = drive_v3.Drive;

export type DriveUploadResult = {
  id: string;
  name: string;
  webContentLink: string | null;
  webViewLink: string | null;
  driveLink: string;
};

function requireGoogleOAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth env vars are missing.");
  }

  return { clientId, clientSecret };
}

function escapeDriveQueryValue(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}
function directDriveLink(fileId: string, mimeType: string) {
  // 🌟 ပုံ (Image) ဖြစ်ခဲ့လျှင် - Website တွင် ပေါ်စေရန် Thumbnail ကို ဆက်သုံးပါမည်
  if (mimeType.startsWith("image/")) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  }

  // 🌟 သီချင်း (Music) ဖြစ်ခဲ့လျှင် - ကျွန်တော်တို့ ရေးထားသော Proxy API ကို အသုံးပြုပါမည်
  return `/api/stream?id=${fileId}`;
}


export function initializeDriveClient(refreshToken: string): DriveClient {
  if (!refreshToken) {
    throw new Error("Google refresh token is missing.");
  }

  const { clientId, clientSecret } = requireGoogleOAuthConfig();
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  return google.drive({ version: "v3", auth: oauth2Client });
}

export async function getOrCreateFolder(
  driveClient: DriveClient,
  folderName: string,
) {
  const query = [
    `mimeType='${GOOGLE_DRIVE_FOLDER_MIME_TYPE}'`,
    `name='${escapeDriveQueryValue(folderName)}'`,
    "trashed=false",
  ].join(" and ");

  const existingFolder = await driveClient.files.list({
    q: query,
    fields: "files(id, name)",
    pageSize: 1,
    spaces: "drive",
  });

  const folderId = existingFolder.data.files?.[0]?.id;
  if (folderId) return folderId;

  const createdFolder = await driveClient.files.create({
    requestBody: {
      name: folderName,
      mimeType: GOOGLE_DRIVE_FOLDER_MIME_TYPE,
    },
    fields: "id",
  });

  if (!createdFolder.data.id) {
    throw new Error(`Failed to create Drive folder: ${folderName}`);
  }

  return createdFolder.data.id;
}

export async function getOrCreateSubFolder(
  driveClient: DriveClient,
  parentFolderId: string,
  subFolderName: string,
) {
  const query = [
    `mimeType='${GOOGLE_DRIVE_FOLDER_MIME_TYPE}'`,
    `name='${escapeDriveQueryValue(subFolderName)}'`,
    `'${escapeDriveQueryValue(parentFolderId)}' in parents`,
    "trashed=false",
  ].join(" and ");

  const existingFolder = await driveClient.files.list({
    q: query,
    fields: "files(id, name)",
    pageSize: 1,
    spaces: "drive",
  });

  const folderId = existingFolder.data.files?.[0]?.id;
  if (folderId) return folderId;

  const createdFolder = await driveClient.files.create({
    requestBody: {
      name: subFolderName,
      mimeType: GOOGLE_DRIVE_FOLDER_MIME_TYPE,
      parents: [parentFolderId],
    },
    fields: "id",
  });

  if (!createdFolder.data.id) {
    throw new Error(`Failed to create Drive folder: ${subFolderName}`);
  }

  return createdFolder.data.id;
}

export async function uploadFileToDrive(
  driveClient: DriveClient,
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  folderId: string,
): Promise<DriveUploadResult> {
  const createdFile = await driveClient.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: Readable.from(fileBuffer),
    },
    fields: "id, name, webContentLink, webViewLink",
  });

  const fileId = createdFile.data.id;
  if (!fileId) {
    throw new Error("Google Drive did not return a file id.");
  }

  await driveClient.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  const publicFile = await driveClient.files.get({
    fileId,
    fields: "id, name, webContentLink, webViewLink",
  });

  const webContentLink = publicFile.data.webContentLink ?? null;
  const webViewLink = publicFile.data.webViewLink ?? null;

  // 🌟 ပြင်ဆင်ချက် - fileId အပြင် mimeType ကိုပါ ထည့်ပေးလိုက်ပါသည်
  const driveLink = directDriveLink(fileId, mimeType);

  return {
    id: fileId,
    name: publicFile.data.name ?? fileName,
    webContentLink,
    webViewLink,
    driveLink,
  };

}


// 🌟 Google Drive မှ ဖိုင်ကို အပြီးတိုင် ဖျက်ပေးမည့် Function အသစ်
export async function deleteFileFromDrive(driveClient: DriveClient, fileId: string) {
  try {
    await driveClient.files.delete({
      fileId: fileId,
    });
    return true;
  } catch (error) {
    console.error("Error deleting file from Google Drive:", error);
    // Error တက်ခဲ့လျှင်တောင် App ကြီး မရပ်သွားအောင် false သာ ပြန်ပေးပါမည်
    return false;
  }
}