pragma solidity ^0.5.0;

contract SocialNetwork{
    string public name;
    uint public postCount=0;
     mapping(uint => Post) public posts;

    struct Post {
        uint id;
        string content;
        uint tipAmount;
        address payable author;
    }

    event PostCreated(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

    event PostTipped(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

    constructor() public{
        name = "Space Exploration is BEST";
    }

    function createPost(string memory _content) public {
      //require valid content
       require(bytes(_content).length > 0); 
      //increment the post count
       postCount++;
       //create the post
       posts[postCount] = Post(postCount, _content, 0, msg.sender);
       //triggering event
       emit PostCreated(postCount, _content, 0, msg.sender);
    }

    function tipPost(uint _id) public payable {
        //make sure that the id is valid
        require(_id >0 && _id <=postCount);
        //fetch the post
        Post memory _post = posts[_id];
        //fetch the author
        address payable _author = _post.author;
        //pay the author
        address(_author).transfer(msg.value);
        //increment the amount
        _post.tipAmount = _post.tipAmount + msg.value;
        //update the post
        posts[_id] = _post;
        //trigger and event
        emit PostTipped(postCount, _post.content, _post.tipAmount, _author);

    }

}