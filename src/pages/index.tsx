import type { NextPage } from 'next'
import Head from 'next/head'
import NextLink from "next/link"
import { VStack, Heading, Box, LinkOverlay, LinkBox} from "@chakra-ui/layout"
import { Text, Button } from '@chakra-ui/react'
import {useState, useEffect} from 'react'
import {ethers} from "ethers"
import ReadERC20 from "components/ReadERC20"
import ApproveERC20 from "components/ApproveERC20"
import TransferERC20 from "components/TransferERC20"
import ReadERC721 from "components/ReadERC721"
import MintERC721 from "components/MintERC721"
import TransferERC721 from "components/TransferERC721"
import TokenURI from "components/TokenURI"
import ClaimERC20 from "components/ClaimERC20"



declare let window: any;

const Home: NextPage = () => {
    const [balance, setBalance] = useState<string | undefined>()
    const [currentAccount, setCurrentAccount] = useState<string | undefined>()
    const [chainId, setChainId] = useState<number | undefined>()
    const [chainname, setChainName] = useState<string | undefined>()
    const ERC20address = '0xCfA59D8E9AE0408C5350E3f84CB027CAe1E2536b';
    const NFTaddress = '0xCCc4EFA14ffA7C34148CDBA01831085852aCc623';

    useEffect(() => {
        if(!currentAccount || !ethers.utils.isAddress(currentAccount)) return
        //client side code
        if(!window.ethereum) return
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        provider.getBalance(currentAccount).then((result)=>{
        setBalance(ethers.utils.formatEther(result))
        })
        provider.getNetwork().then((result)=>{
        setChainId(result.chainId)
        setChainName(result.name)
        })

    },[currentAccount])

    const onClickConnect = () => {
        if(!window.ethereum) {
        console.log("please install MetaMask")
        return
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        provider.send("eth_requestAccounts", [])
        .then((accounts)=>{
        if(accounts.length>0) setCurrentAccount(accounts[0])
        })
        .catch((e)=>console.log(e))
    }

    const onClickDisconnect = () => {
        console.log("onClickDisConnect")
        setBalance(undefined)
        setCurrentAccount(undefined)
    }

    return (
        <>
        <Head>
            <title>My DAPP</title>
        </Head>

        <Heading as="h3"  my={4}>NFT Project</Heading>          
        <VStack>
            <Box w='100%' my={4}>
            {currentAccount  
            ? <Button type="button" w='100%' onClick={onClickDisconnect}>
                    Account:{currentAccount}
                </Button>
            : <Button type="button" w='100%' onClick={onClickConnect}>
                    Connect MetaMask
                </Button>
            }
            </Box>
            {currentAccount  
            ?<Box  mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
            <Heading my={4}  fontSize='xl'>Account info</Heading>
            <Text>ETH Balance of current account: {balance}</Text>
            <Text>Chain Info: ChainId {chainId}</Text>
            </Box>
            :<></>
            }
            <Box  mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
                <Heading my={4}  fontSize='xl'>My NFT Collection Info</Heading>
                <ReadERC721 
                    addressContract={NFTaddress}
                    currentAccount={currentAccount}
                />
                <a> Minting a NFT takes 0.05 Sepolia Eth</a>
                <MintERC721 
                    addressContract = {NFTaddress}
                    currentAccount={currentAccount}
                />
                
            </Box>
            <Box  mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
                <Heading my={4}  fontSize='xl'>Transfer NFTs</Heading>
                <a> 20 MT tokens should be approved by the buyer address to the address contract</a>
                <p> </p>
                <TransferERC721
                    addressContract={NFTaddress}
                    currentAccount={currentAccount}
                />
            </Box>
            <Box  mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
                <Heading my={4}  fontSize='xl'>Claim Tokens</Heading>
                <ClaimERC20
                    addressContract={NFTaddress}
                    currentAccount={currentAccount}
                />
            </Box>
            <Box  mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
                <Heading my={4}  fontSize='xl'>View NFT </Heading>
                <TokenURI
                    addressContract={NFTaddress}
                    currentAccount={currentAccount}
                />
            </Box>
            <Box  mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
                <Heading my={4}  fontSize='xl'>MyToken Info</Heading>
                <ReadERC20 
                    addressContract={ERC20address}
                    currentAccount={currentAccount}
                />
            </Box>
            <Box  mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
                <Heading my={4}  fontSize='xl'>Transfer MyToken</Heading>
                <TransferERC20 
                    addressContract={ERC20address}
                    currentAccount={currentAccount}
                />
            </Box>
            <Box  mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
                <Heading my={4}  fontSize='xl'>Approve MyToken</Heading>
                <ApproveERC20 
                    addressContract={ERC20address}
                    currentAccount={currentAccount}
                />
            </Box>
            
        </VStack>
        </>
    )
}

export default Home