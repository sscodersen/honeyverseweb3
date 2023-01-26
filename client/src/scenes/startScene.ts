import WalletConnectProvider from "@walletconnect/web3-provider"
import { ethers } from "ethers"
import Web3Modal from "web3modal"

const connectWallet = async () => {
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                infuraId: "0e7fcc143f894d179aa51dbdc44d8ac5"
            }
        },
    }
    const web3Modal = new Web3Modal({
        providerOptions
    })

    web3Modal.clearCachedProvider()

    let instance

    instance = await web3Modal.connect()

    const provider = new ethers.providers.Web3Provider(instance)
    const signer = provider.getSigner()
    return signer
}

export class StartScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'start-scene'
        })
    }

    preload() {
    }

    create() {
        connectWallet().then((signer) => {
            this.scene.start('dungeon-scene', { signer });
        });
    }
}