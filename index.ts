import { PublicKey } from "@solana/web3.js";
import { main_menu_display, rl, screen_clear, settings_display } from "./src/menu";
import { readSettings, saveSettingsToFile, sleep } from "./src/utils/utils";
import { swap, buy_monitor_autosell, mainKp } from "./src/layout/buy";
import { sell_token } from "./src/layout/sell";
import { PumpAmmSdk } from "@pump-fun/pump-swap-sdk";
import { solanaConnection } from "./src/constants";
import { BN } from "bn.js";

const testBuy = async () => {
    const pSwap = new PumpAmmSdk(solanaConnection);
    const amount = new BN(27000000);
    const slippage = 50;

    const result = await swap(pSwap, new PublicKey("JBwuyZai99UaNedXXxihdJiZ4cJdotJZnSxBsCz1inja"), new PublicKey("Bhu2wBWxfWkRJ6pFn5NodnEvMCqj9DLfCU5qMvt7pump"), amount, slippage, mainKp, "quoteToBase");
    console.log("🚀 ~ testBuy ~ result:", result)
}

// testBuy()

export const init = () => {
    screen_clear();
    console.log("Raydium Trading Bot");

    main_menu_display();

    rl.question("\t[Main] - Choice: ", async (answer: string) => {
        let choice = parseInt(answer);
        switch (choice) {
            case 1:
                show_settings();
                break;
            case 2:
                settings();
                break;
            case 3:
                buy_monitor_autosell();
                break;
            case 4:
                sell_token();
                break;
            case 5:
                process.exit(1);
            default:
                console.log("\tInvalid choice!");
                await sleep(1500);
                init();
                break;
        }
    })
}

export const mainMenuWaiting = () => {
    rl.question('\x1b[32mpress Enter key to continue\x1b[0m', (answer: string) => {
        init()
    })
}

const show_settings = async () => {
    let data = readSettings()

    console.log("Current settings of Trading bot...")
    console.log(data)
    mainMenuWaiting()
}

const settings = () => {
    screen_clear();
    console.log("Settings")
    settings_display();

    rl.question("\t[Settings] - Choice: ", (answer: string) => {
        let choice = parseInt(answer);
        switch (choice) {
            case 1:
                set_mint();
                break;
            case 2:
                set_poolid();
                break;
            case 3:
                set_pump();
                break;
            case 4:
                set_amount();
                break;
            case 5:
                set_slippage();
                break;
            case 6:
                init();
                break;
            case 7:
                process.exit(1);
            default:
                console.log("\tInvalid choice!");
                sleep(1500);
                settings_display();
                break;
        }
    })
}

const settingsWaiting = () => {
    rl.question('\x1b[32mpress Enter key to continue\x1b[0m', (answer: string) => {
        settings()
    })
}

const set_mint = () => {
    screen_clear();
    let data = readSettings()
    let settings = {
        mint: new PublicKey(data.mint!),
        poolId: new PublicKey(data.poolId!),
        isPump: data.isPump!,
        amount: Number(data.amount),
        slippage: Number(data.slippage)
    }
    console.log(`Please Enter the contract address of the token you want, current mint is ${settings.mint}`)
    rl.question("\t[Contract Address of the token] - Address: ", (answer: string) => {
        if (answer == 'c') {
            settingsWaiting()
            return
        }
        let choice = new PublicKey(answer);
        settings.mint = choice
        saveSettingsToFile(settings)
        console.log(`Mint ${answer} is set correctly!`)
        settingsWaiting()
    })
}

const set_poolid = () => {
    screen_clear();
    let data = readSettings()
    let settings = {
        mint: new PublicKey(data.mint!),
        poolId: new PublicKey(data.poolId!),
        isPump: data.isPump!,
        amount: Number(data.amount),
        slippage: Number(data.slippage)
    }
    console.log(`Please Enter the Pool address of the token you want, current poolId is ${settings.poolId}`)
    rl.question("\t[Pool Address of the token] - Address: ", (answer: string) => {
        if (answer == 'c') {
            settingsWaiting()
            return
        }
        let choice = new PublicKey(answer);
        settings.poolId = choice
        saveSettingsToFile(settings)
        console.log(`PoolId ${answer} is set correctly!`)
        settingsWaiting()
    })
}

const set_amount = () => {
    screen_clear();
    let data = readSettings()
    let settings = {
        mint: new PublicKey(data.mint!),
        poolId: new PublicKey(data.poolId!),
        isPump: data.isPump!,
        amount: Number(data.amount),
        slippage: Number(data.slippage)
    }
    console.log(`Please Enter the amount you want, current amount is ${settings.amount}`)
    rl.question("\t[Number of Wallets] - Number: ", (answer: string) => {
        if (answer == 'c') {
            settingsWaiting()
            return
        }
        let choice = Number(answer);
        settings.amount = choice
        saveSettingsToFile(settings)
        console.log(`Buy amount ${answer} is set correctly!`)
        settingsWaiting()
    })
}

const set_pump = () => {
    screen_clear();
    let data = readSettings()
    let settings = {
        mint: new PublicKey(data.mint!),
        poolId: new PublicKey(data.poolId!),
        isPump: data.isPump!,
        amount: Number(data.amount),
        slippage: Number(data.slippage)
    }
    console.log(`Please Enter 0 or 1 depends the token is Pumpfun token or not, current value is ${settings.isPump}`)
    rl.question("\t[Is Pumpfun token?] - Number: ", (answer: string) => {
        if (answer == 'c') {
            settingsWaiting()
            return
        }
        let choice: Boolean = parseInt(answer) == 0 ? false : true;
        settings.isPump = choice
        saveSettingsToFile(settings)
        console.log(`Take Profit ${answer}% is set correctly!`)
        settingsWaiting()
    })
}

const set_slippage = () => {
    screen_clear();
    let data = readSettings()
    let settings = {
        mint: new PublicKey(data.mint!),
        poolId: new PublicKey(data.poolId!),
        isPump: data.isPump!,
        amount: Number(data.amount),
        slippage: Number(data.slippage)
    }
    console.log(`Please Enter the Number for slippage you want, current value is ${settings.slippage}`)
    rl.question("\t[Percent of Slippage ] - Number: ", (answer: string) => {
        if (answer == 'c') {
            settingsWaiting()
            return
        }
        let choice = parseInt(answer);
        settings.slippage = choice
        saveSettingsToFile(settings)
        console.log(`Slippage ${answer}% is set correctly!`)
        settingsWaiting()
    })
}

init()