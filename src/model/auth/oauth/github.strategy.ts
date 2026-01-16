// import passport from "passport";
// import { Strategy as GitHubStrategy } from "passport-github2";

// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID!,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET!,
//       callbackURL: "/auth/github/callback"
//     },
//     async (_, __, profile, done) => {
//       const email = profile.emails?.[0].value;
//       done(null, { email });
//     }
//   )
// );
