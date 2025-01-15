module.exports = ({ env }) => ({
    upload: {
        config: {
            provider: 'aws-s3',
            providerOptions: {
                s3Options: {
                    endpoint: env('S3_ENDPOINT'),
                    region: env('S3_REGION'),
                    credentials: {
                        accessKeyId: env('S3_ACCESS_KEY'),
                        secretAccessKey: env('S3_SECRET_KEY'),
                    },
                },
                params: {
                    Bucket: env('S3_BUCKET'),
                },
                forcePathStyle: env.bool('S3_FORCE_PATH_STYLE', true),
                baseUrl: env('S3_BASE_URL') ? `${env('S3_BASE_URL')}/${env('S3_BUCKET')}` : null,
            },
            actionOptions: {
                upload: {
                    ACL: 'public-read',
                },
                uploadStream: {
                    ACL: 'public-read',
                },
                delete: {},
            },
        },
    }
});
