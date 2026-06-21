import Post from '../models/post.model.js';
import { publishToLinkedIn } from './linkedin.service.js';
import { sendEmail } from './notification.service.js';

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

    await sendEmail(
      null,
      '✅ Solus: Post Published Successfully',
      `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #16a34a; margin-bottom: 16px;">Post Published</h2>
          <p>Your scheduled post has been published to LinkedIn.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Post ID</td><td>${postId}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">LinkedIn Post ID</td><td>${linkedinPostId}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Time</td><td>${new Date().toISOString()}</td></tr>
          </table>
          ${content ? `
            <h3 style="color: #374151;">Post Content Preview</h3>
            <pre style="background: #f3f4f6; padding: 12px; border-radius: 8px; overflow: auto; white-space: pre-wrap; font-size: 13px;">${content.slice(0, 500)}${content.length > 500 ? '...' : ''}</pre>
          ` : ''}
        </div>
      `
    );

    return post;
  } catch (err) {
    post.status = 'failed';
    await post.save();

    console.error(`[Publisher] Post ${postId} publish failed:`, err.message);

    await sendEmail(
      null,
      '⚠️ Solus: Post Publish Failed',
      `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #dc2626; margin-bottom: 16px;">Post Publish Failed</h2>
          <p>A scheduled post failed to publish to LinkedIn.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Post ID</td><td>${postId}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Error</td><td style="color: #dc2626;">${err.message}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Time</td><td>${new Date().toISOString()}</td></tr>
          </table>
          ${content ? `
            <h3 style="color: #374151;">Post Content Preview</h3>
            <pre style="background: #f3f4f6; padding: 12px; border-radius: 8px; overflow: auto; white-space: pre-wrap; font-size: 13px;">${content.slice(0, 500)}${content.length > 500 ? '...' : ''}</pre>
          ` : ''}
          <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">Check the Solus dashboard for details.</p>
        </div>
      `
    );

    throw err;
  }
}
