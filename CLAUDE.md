# Project Context

The Project is called Primal, its a social media platform for sharing gaming clips with each other.

# Bash commands

- npm run build: Build the project
- npm run dev: For development
- npm run lint: For linting
- npm run test: For Jest testing

# Technology Stack

- Frontend: Next.js 15, React 19, Tailwind
- Backend: Next.js API routes with MongoDB/Mongoose
- Metadata is saved in MongoDB such as User, Clip and Reactions
- Authentication: NextAuth with Google and Discord OAuth
- Clips are saved to external S3 storage
- Optional Video Compression with ExpressJS and FFmpeg on an external server
- Redis for caching
- Jest for testing
- Next-intl for translations
- Docker for deployment
- Prettier formatting

# Project structure

- Modern NextJS routing
- External services: `services/`
- Translations: `messanges/`
- Jest testing are located in `/__tests__` directories in the same location as the related production code
- Types: `src/types`
- Components: `src/components`
- Databases: `src/lib/db`

# Code style

- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')
- Do not use any types
- Be aware for linting requirements

# Workflow

- Be sure to typecheck when you’re done making a series of code changes
- Add tests to make sure functionality works
