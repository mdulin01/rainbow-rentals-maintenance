# Rainbow Rentals — Project Guidelines

## Key URLs & Resources

| Resource | URL |
|----------|-----|
| **Live Site** | https://rainbowrentals.app |
| **GitHub Repository** | https://github.com/mdulin01/rainbow-rentals |
| **Firebase Console** | https://console.firebase.google.com/project/rainbow-rentals |
| **Vercel Dashboard** | https://vercel.com/dashboard |

## Technical Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend/Database:** Firebase (Firestore, Authentication, Storage)
- **Deployment:** Vercel
- **Version Control:** GitHub (mdulin01/rainbow-rentals)

## File Scope Boundary

**CRITICAL: When working on this project, ONLY access files within the `rainbow-rentals/` directory.** Do not read, write, or reference files from any sibling project folder (dulinproperties, lifedesigncourse, downtownGSO, etc.). If you need something from another project, stop and ask first.

## Notes

- This project shares a similar structure with `dulinproperties` but they are **completely separate** — separate Firebase projects, separate repos, separate domains, separate Vercel deployments.
- Firebase config is currently hardcoded in `src/firebase-config.js` (project: rainbow-rentals).
- Main component: `src/rainbow-rentals.jsx`
