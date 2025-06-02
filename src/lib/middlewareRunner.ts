import { NextApiRequest, NextApiResponse } from 'next'; // Or NextRequest, NextResponse if using App Router exclusively

// Helper to run Express-style middleware in Next.js API routes
export async function runMiddleware(req: any, res: any, fns: Function | Function[]) {
  if (Array.isArray(fns)) {
    for (const fn of fns) {
      await new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
          if (result instanceof Error) {
            return reject(result);
          }
          return resolve(result);
        });
      });
    }
  } else {
    await new Promise((resolve, reject) => {
      fns(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  }
}