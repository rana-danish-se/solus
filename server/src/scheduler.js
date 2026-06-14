import cron from 'node-cron';
import Post from './models/post.model.js';
import { publishPost } from './services/publisher.service.js';

export function startScheduler() {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const due = await Post.find({
        status: 'scheduled',
        scheduledAt: { $lte: now },
      });

      if (due.length === 0) return;

      console.log(`[Scheduler] Found ${due.length} post(s) due for publishing`);

      for (const post of due) {
        try {
          await publishPost(post._id);
        } catch (err) {
          console.error(`[Scheduler] Failed to publish post ${post._id}:`, err.message);
        }
      }
    } catch (err) {
      console.error('[Scheduler] Error during tick:', err.message);
    }
  });

  console.log('[Scheduler] Cron job started (every minute)');
}
