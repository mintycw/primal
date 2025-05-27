FROM node:23-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV MONGODB_URI=placeholder \
    S3_ENDPOINT=placeholder \
    S3_BUCKET=clip-storage \
    S3_REGION=eu-central-1 \
    S3_ACCESS_KEY=placeholder \
    S3_SECRET_KEY=placeholder \

    VIDEO_COMPRESSION=false \
    VIDEO_COMPRESSION_ENDPOINT=placeholder \

    LOCAL_VIDEO_COMPRESSION=false \
    LOCAL_VIDEO_CODEC=hevc_videotoolbox \

    GOOGLE_CLIENT_ID=placeholder \
    GOOGLE_CLIENT_SECRET=placeholder \

    DISCORD_CLIENT_ID=placeholder \
    DISCORD_CLIENT_SECRET=placeholder \

    NEXTAUTH_SECRET=placeholder \
    NEXTAUTH_URL=https://primal.turboot.com

RUN npm run build

# Port
EXPOSE 3000

# Start app
CMD ["npm", "start"]