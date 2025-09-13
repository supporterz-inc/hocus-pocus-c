import { Hono } from 'hono';
import { getAllKnowledgesController } from './controllers/get-all-knowledges.controller.js';

export interface Variables {
  userId: string;
}

export const router = new Hono<{ Variables: Variables }>();

router.get('/', (ctx) => {
  // MEMO: `ctx.get('userId')` によって、必要に応じて UserID を利用できる
  const userId = ctx.get('userId');
  console.log('Signed-in :', userId);

  // MEMO: Controller は Context を直接受け取らず、必要な情報のみを引数に受け取る
  return ctx.html(getAllKnowledgesController(userId));
});
