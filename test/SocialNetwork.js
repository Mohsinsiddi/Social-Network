const SocialNetwork = artifacts.require("./SocialNetwork.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('SocialNetwork',([deployer, author, tipper]) =>{
        let socialNetwork
        
        before( async()=>{                
        socialNetwork = await SocialNetwork.deployed()
        })

        describe('Deployment',async() =>{
            it('Deployed Successfully', async() => {
                const address = await socialNetwork.address
                assert.notEqual(address, 0x0)
                assert.notEqual(address, '')
                assert.notEqual(address, null)
                assert.notEqual(address, undefined)
            
            })
            it('has a name', async() =>{
                const name = await socialNetwork.name()
                assert.equal(name, 'Space Exploration is BEST')
            })
        })

       describe('posts',async()=>{

           let result
           let postCount
            before( async()=>{
            result = await socialNetwork.createPost('Alber Einstein is my FAV #1st POST',{from: author})
            postCount = await socialNetwork.postCount()
            })

           it('create a post', async()=>{

            //SUCCESS
            assert.equal(postCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(),postCount.toNumber(),'ID is Correct')
            assert.equal(event.content,'Alber Einstein is my FAV #1st POST','Content is Correct')
            assert.equal(event.tipAmount,0,'Tip Amount is Correct')
            assert.equal(event.author, author,'Author address is Correct')
            
            //FAILURE WHEN NO CONTENT IN POST
            await socialNetwork.createPost('',{from: author}).should.be.rejected

           })
           it('list all post',async()=>{
            const post = await socialNetwork.posts(postCount)
            assert.equal(post.id.toNumber(),postCount.toNumber(),'ID is Correct')
            assert.equal(post.content,'Alber Einstein is my FAV #1st POST','Content is Correct')
            assert.equal(post.tipAmount,0,'Tip Amount is Correct')
            assert.equal(post.author, author,'Author address is Correct')
           })
           it('Tip a post', async()=>{
            
            //track the author balance before purcahse
            let OldAuthorBalance
            OldAuthorBalance = await web3.eth.getBalance(author)
            OldAuthorBalance = new web3.utils.BN(OldAuthorBalance)

            result = await socialNetwork.tipPost(postCount, {from: tipper, value: web3.utils.toWei('1','Ether')})
            
            //SUCCESS
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(),postCount.toNumber(),'ID is Correct')
            assert.equal(event.content,'Alber Einstein is my FAV #1st POST','Content is Correct')
            assert.equal(event.tipAmount,1000000000000000000,'Tip Amount is Correct')
            assert.equal(event.author, author,'Author address is Correct')
           
           //check the author received funds
            let NewAuthorBalance
            NewAuthorBalance = await web3.eth.getBalance(author)
            NewAuthorBalance = new web3.utils.BN(NewAuthorBalance)
             
             let tipAmount
             tipAmount = web3.utils.toWei('1','Ether')
             tipAmount = new web3.utils.BN(tipAmount)
             
             const expectedBalance = OldAuthorBalance.add(tipAmount)

             assert.equal(NewAuthorBalance.toString(), expectedBalance.toString())

             //tries to tip a post that doesnt exit
             await socialNetwork.tipPost(99,{from: tipper, value: web3.utils.toWei('1','Ether')}).should.be.rejected; 

           })
       }) 
})