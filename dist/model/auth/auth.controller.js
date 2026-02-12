"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestOtp = requestOtp;
exports.verifyOtp = verifyOtp;
exports.googleAuth = googleAuth;
exports.googleCallback = googleCallback;
exports.githubAuth = githubAuth;
const AuthService = __importStar(require("./auth.service"));
const passport_1 = __importDefault(require("passport"));
async function requestOtp(req, res) {
    await AuthService.sendOtp(req.body.email);
    res.json({ message: "OTP sent" });
}
async function verifyOtp(req, res) {
    const result = await AuthService.verifyOtp(req.body.email, req.body.otp);
    res.json(result);
}
// OAuth redirects
function googleAuth(req, res) {
    passport_1.default.authenticate("google", { scope: ["email", "profile"] })(req, res);
}
function googleCallback(req, res) {
    passport_1.default.authenticate("google", { session: false }, async (err, user) => {
        const result = await AuthService.handleOAuthLogin(user.email, "google");
        res.json(result);
    })(req, res);
}
function githubAuth(req, res) {
    passport_1.default.authenticate("github", { scope: ["user:email"] })(req, res);
}
// export function githubCallback(req: Request, res: Response) {
//   passport.authenticate("github", { session: false }, async (err, user) => {
//     const result = await AuthService.handleOAuthLogin(user.email, "github");
//     res.json(result);
//   })(req, res);
// }
