import mongoose from "mongoose";
import Token from "../models/Token";
import { NextFunction, Request, Response } from "express";
import Episode, { EpisodeType } from "../models/Episode";

declare module "express-serve-static-core" {
    interface Request {
        token?: { token: string, grantedAt: NativeDate };
        user?: any;
        episode?: EpisodeType;
    }
}

export interface withAuthParams {
    token: string,
}

export default async function withAuth(req: Request<withAuthParams>, res: Response<any, Record<string, any>>, next: NextFunction) {
    if (!req.headers.authorization) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const [prefix, token] = req.headers?.authorization?.split(' ');
    if (prefix != "Token") {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    } else if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const isTokenValid = await Token.findOne({ token }).populate('user');

    if (!isTokenValid || isTokenValid.token == undefined || isTokenValid.grantedAt == undefined) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    req.token = { token: isTokenValid.token, grantedAt: isTokenValid.grantedAt };
    req.user = isTokenValid.user;

    next();
}

export async function withAdminAuth(req: Request<withAuthParams>, res: Response<any, Record<string, any>>, next: NextFunction) {
    if (!req.headers.authorization) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const [prefix, token] = req.headers?.authorization?.split(' ');
    if (prefix != "Token") {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    } else if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const isTokenValid = await Token.findOne({ token }).populate('user');

    if (!isTokenValid || isTokenValid.token == undefined || isTokenValid.grantedAt == undefined) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    req.token = { token: isTokenValid.token, grantedAt: isTokenValid.grantedAt };
    req.user = isTokenValid.user;

    if (!req.user.admin) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    next();
}