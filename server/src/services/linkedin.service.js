import axios from 'axios';

const LINKEDIN_API_BASE = 'https://api.linkedin.com';

const ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const RAW_PERSON_URN = process.env.LINKEDIN_PERSON_URN;
const PERSON_URN = RAW_PERSON_URN?.startsWith('urn:li:person:')
  ? RAW_PERSON_URN
  : `urn:li:person:${RAW_PERSON_URN}`;

if (!ACCESS_TOKEN) {
  console.warn('[LinkedIn] LINKEDIN_ACCESS_TOKEN is not set. LinkedIn publishing will fail.');
}
if (!RAW_PERSON_URN) {
  console.warn('[LinkedIn] LINKEDIN_PERSON_URN is not set. LinkedIn publishing will fail.');
}

const linkedinClient = axios.create({
  baseURL: LINKEDIN_API_BASE,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    'X-Restli-Protocol-Version': '2.0.0',
  },
  timeout: 30000,
});

function assertCredentials() {
  if (!ACCESS_TOKEN) {
    throw new Error('LinkedIn credentials missing: LINKEDIN_ACCESS_TOKEN is not set in environment.');
  }
  if (!RAW_PERSON_URN) {
    throw new Error('LinkedIn credentials missing: LINKEDIN_PERSON_URN is not set in environment.');
  }
}

function detectImageMimeType(imageUrl) {
  const lower = imageUrl.toLowerCase().split('?')[0].split('#')[0];
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.heic')) return 'image/heic';
  return 'image/jpeg';
}

function buildTextOnlyPostBody(content) {
  return {
    author: PERSON_URN,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text: content,
        },
        shareMediaCategory: 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };
}

function buildImagePostBody(content, assetUrn) {
  return {
    author: PERSON_URN,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text: content,
        },
        shareMediaCategory: 'IMAGE',
        media: [
          {
            status: 'READY',
            description: {
              text: 'Attached image',
            },
            media: assetUrn,
            title: {
              text: 'Image post',
            },
          },
        ],
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };
}

async function registerImageAsset() {
  try {
    console.log('[LinkedIn] Step 1/3: Registering image asset...');
    const registerPayload = {
      registerUploadRequest: {
        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
        owner: PERSON_URN,
        serviceRelationships: [
          {
            relationshipType: 'OWNER',
            identifier: 'urn:li:userGeneratedContent',
          },
        ],
      },
    };

    const response = await linkedinClient.post('/v2/assets?action=registerUpload', registerPayload);

    const uploadUrl =
      response.data?.value?.uploadMechanism?.['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']?.uploadUrl;
    const assetUrn = response.data?.value?.asset;

    if (!uploadUrl || !assetUrn) {
      throw new Error('LinkedIn asset registration response missing uploadUrl or asset URN.');
    }

    console.log(`[LinkedIn] Asset registered: ${assetUrn}`);
    return { uploadUrl, assetUrn };
  } catch (err) {
    const reason = err.response?.data || err.message;
    console.error('[LinkedIn] Asset registration failed:', reason);
    throw new Error(`LinkedIn asset registration failed: ${JSON.stringify(reason)}`);
  }
}

async function uploadImageBinary(uploadUrl, imageUrl) {
  try {
    console.log(`[LinkedIn] Step 2/3: Fetching image from ${imageUrl}...`);
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 60000 });
    const imageBuffer = Buffer.from(imageResponse.data);
    const mimeType = detectImageMimeType(imageUrl);

    console.log(`[LinkedIn] Uploading ${imageBuffer.length} bytes to LinkedIn (${mimeType})...`);
    await axios.put(uploadUrl, imageBuffer, {
      headers: {
        'Content-Type': mimeType,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: 60000,
    });

    console.log('[LinkedIn] Image binary upload complete.');
  } catch (err) {
    const reason = err.response?.data || err.message;
    console.error('[LinkedIn] Image binary upload failed:', reason);
    throw new Error(`LinkedIn image upload failed: ${JSON.stringify(reason)}`);
  }
}

async function publishImagePost(content, imageUrl) {
  try {
    const { uploadUrl, assetUrn } = await registerImageAsset();
    await uploadImageBinary(uploadUrl, imageUrl);

    console.log('[LinkedIn] Step 3/3: Publishing image post...');
    const postBody = buildImagePostBody(content, assetUrn);
    const response = await linkedinClient.post('/v2/ugcPosts', postBody);

    const postId = response.data?.id;
    if (!postId) {
      throw new Error('LinkedIn image post published but no post ID returned.');
    }

    console.log(`[LinkedIn] Image post published successfully: ${postId}`);
    return postId;
  } catch (err) {
    const reason = err.response?.data || err.message;
    console.error('[LinkedIn] Image post publish failed:', reason);
    throw new Error(`LinkedIn image post publish failed: ${JSON.stringify(reason)}`);
  }
}

async function publishTextPost(content) {
  try {
    console.log('[LinkedIn] Publishing text-only post...');
    const postBody = buildTextOnlyPostBody(content);
    const response = await linkedinClient.post('/v2/ugcPosts', postBody);

    const postId = response.data?.id;
    if (!postId) {
      throw new Error('LinkedIn text post published but no post ID returned.');
    }

    console.log(`[LinkedIn] Text post published successfully: ${postId}`);
    return postId;
  } catch (err) {
    const reason = err.response?.data || err.message;
    console.error('[LinkedIn] Text post publish failed:', reason);
    throw new Error(`LinkedIn text post publish failed: ${JSON.stringify(reason)}`);
  }
}

export async function publishToLinkedIn(content, imageUrl = null) {
  try {
    assertCredentials();

    if (!content || typeof content !== 'string' || !content.trim()) {
      throw new Error('LinkedIn post content cannot be empty.');
    }

    console.log(`[LinkedIn] Starting publish flow (image: ${imageUrl ? 'yes' : 'no'})`);

    if (imageUrl) {
      return await publishImagePost(content, imageUrl);
    }

    return await publishTextPost(content);
  } catch (err) {
    console.error('[LinkedIn] publishToLinkedIn failed:', err.message);
    throw err;
  }
}
