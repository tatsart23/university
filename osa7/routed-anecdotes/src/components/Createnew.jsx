import { useNavigate } from "react-router-dom";
import { useField } from "../hooks/index";

const Createnew = ({ addNew, setNotification }) => {
  const content = useField("text");
  const author = useField("text");
  const info = useField("text");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    addNew({
      content: content.inputProps.value,
      author: author.inputProps.value,
      info: info.inputProps.value,
      votes: 0,
    });
    setNotification(`A new anecdote "${content.inputProps.value}" created!`);
    navigate("/"); // Navigoi takaisin pääsivulle
    setTimeout(() => setNotification(""), 5000);

    // Nollataan kentät
    content.reset();
    author.reset();
    info.reset();
  };

  const handleReset = (e) => {
    e.preventDefault();
    content.reset();
    author.reset();
    info.reset();
  };

  return (
    <div>
      <h2>Create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content.inputProps} />
        </div>
        <div>
          author
          <input {...author.inputProps} />
        </div>
        <div>
          url for more info
          <input {...info.inputProps} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>
          reset
        </button>
      </form>
    </div>
  );
};

export default Createnew;
