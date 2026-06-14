import Post from '../models/post.model.js';
import { publishToLinkedIn } from './linkedin.service.js';

export async function publishPost(postId) {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error(`Post ${postId} not found`);
  }

  const content = post.content || '';
  const imageUrl = post.image?.url || null;

  try {
    const linkedinPostId = await publishToLinkedIn(content, imageUrl);

    post.status = 'published';
    post.publishedAt = new Date();
    post.linkedinPostId = linkedinPostId;
    await post.save();

    console.log(`[Publisher] Post ${postId} published successfully (LinkedIn: ${linkedinPostId})`);
    return post;
  } catch (err) {
    post.status = 'failed';
    await post.save();

    console.error(`[Publisher] Post ${postId} publish failed:`, err.message);
    // TODO: replace with Twilio notification

    throw err;
  }
}
