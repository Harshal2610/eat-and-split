import { useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friend, setFriend] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);

  const [selectFriend, setSelectFriend] = useState(null);

  function handelShowAddFriend() {
    setShowAddFriend((show) => !show);
  }
  function handelAddFriend(friends) {
    setFriend((friend) => [...friend, friends]);
    setShowAddFriend(false);
  }
  function handelSelection(friend) {
    // setSelectFriend(friend);
    setSelectFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handelSplittBill(value) {
    console.log(value);
    setFriend((friends) =>
      friends.map((friend) =>
        friend.id === selectFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friend={friend}
          onSelection={handelSelection}
          selectFriend={selectFriend}
        />
        ;{showAddFriend && <FormAddAfriend onAddFriend={handelAddFriend} />}
        <Button onClick={handelShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectFriend && (
        <FormSplitBill
          selectFriend={selectFriend}
          onSplitBill={handelSplittBill}
          setSelectFriend={setSelectFriend}
          key={selectFriend.id}
        />
      )}
    </div>
  );
}

function FriendList({ friend, onSelection, selectFriend }) {
  return (
    <ul>
      {friend.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectFriend={selectFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectFriend }) {
  const isSelected = selectFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt="" />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddAfriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handelSubmit(e) {
    e.preventDefault();
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);
    setImage("");
    setName("");
  }
  return (
    <form className="form-add-friend" onSubmit={handelSubmit}>
      <label>Friend Name</label>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectFriend, onSplitBill, setSelectFriend }) {
  const [bill, setBill] = useState("");
  const [payedByUser, setPayedByUser] = useState("");
  const paidByFriend = bill && bill - payedByUser;
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  function handelSubmit(e) {
    e.preventDefault();
    if (!bill || !payedByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -payedByUser);
    setSelectFriend(null);
  }
  return (
    <form className="form-split-bill" onSubmit={handelSubmit}>
      <h2>Split Bill With {selectFriend.name}</h2>
      <label>Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>Your Expense</label>
      <input
        type="text"
        value={payedByUser}
        onChange={(e) =>
          setPayedByUser(
            Number(e.target.value) > bill ? payedByUser : Number(e.target.value)
          )
        }
      />
      <label>{selectFriend.name}'s Expense</label>
      <input type="text" disabled value={paidByFriend} />
      <label>Who's Paying</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="Friend">{selectFriend.name}</option>
      </select>
      <button className="button">Split Bill</button>
    </form>
  );
}
