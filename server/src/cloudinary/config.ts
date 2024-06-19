import { v2 as cloudinary } from "cloudinary"

const cloudinaryConfig = async () => {
    cloudinary.config({
        cloud_name: "dzvgcx6gi",
        api_key: "138515198932395",
        api_secret: "IN3B9Nu_91g_XLb52YbOzcAdpFU"


    })
}

export {
    cloudinaryConfig
}