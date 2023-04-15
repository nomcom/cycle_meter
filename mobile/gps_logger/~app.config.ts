import { ConfigContext } from "@expo/config"
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import merge from 'deepmerge';

export default ({ config }: ConfigContext) => {
    const result = merge(config,
        {
            "android": {
                "config": {
                    "googleMaps": {
                        "apiKey": process.env.GOOGLEMAP_ANDROID_API_KEY
                    }
                }
            }
        });
    console.log("XX CONFIG:");
    console.log(JSON.stringify(result));
    return result;
}