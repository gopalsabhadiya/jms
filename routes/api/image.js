const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/auth');
const { createItem} = require('../../service/image');
const AWS = require('aws-sdk')

/**
 *  @route     POST api/users
 *  @desc      Register User
 *  @access    Public
 */
router.get(
    '/item/fetch_signed_url',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {
            console.log("Page:" + req.query.page);

            AWS.config.update({
                accessKeyId: 'AKIAUOA3LJ4DIGXUK2NJ',
                secretAccessKey: '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',
                region: 'ap-south-1',
                signatureVersion: 'v4'
            });
            const s3 = new AWS.S3();
            const myBucket = 'zbimage';
            const myKey = req.query.id;
            const signedUrlExpireSeconds = 60 * 5;

            const url = s3.getSignedUrl('getObject', {
                Bucket: myBucket,
                Key: myKey,
                Expires: signedUrlExpireSeconds,

            });

            console.log(url);
            return res.json({"url":url});

        } catch (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
    }
);

router.get(
    '/item/post_signed_url',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {

            if(!req.query.id){
                return res.status(400).json({msg: "Query param id mandatory"});
            }

            AWS.config.update({
                accessKeyId: 'AKIAUOA3LJ4DIGXUK2NJ',
                secretAccessKey: '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',
                region: 'ap-south-1',
                signatureVersion: 'v4'
            });
            const s3 = new AWS.S3();
            const myBucket = 'zbimage'
            const myKey = req.query.id;
            const signedUrlExpireSeconds = 60 * 5

            const url = s3.getSignedUrl('putObject', {
                Bucket: myBucket,
                Key: myKey,
                Expires: signedUrlExpireSeconds,
            },);

            console.log(url);
            return res.json({"url":url});

        } catch (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
    }
);

module.exports = router;