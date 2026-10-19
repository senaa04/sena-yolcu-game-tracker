import { useEffect, useState } from "react";

function App() {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("Oynanacak");
  const [editingId, setEditingId] = useState(null);

  const [games, setGames] = useState(() => {
    const savedGames = localStorage.getItem("games");

    if (savedGames === null) {
      return [];
    }

    return JSON.parse(savedGames);
  });

  useEffect(() => {
    localStorage.setItem("games", JSON.stringify(games));
  }, [games]);

  function handleSubmit(event) {
    event.preventDefault();

    if (title.trim() === "" || platform.trim() === "") {
      alert("Oyun adı ve platform boş bırakılamaz.");
      return;
    }

    if (editingId !== null) {
      const updatedGames = games.map((game) =>
        game.id === editingId
          ? {
              ...game,
              title: title,
              platform: platform,
              status: status,
            }
          : game
      );

      setGames(updatedGames);
      setEditingId(null);
    } else {
      const newGame = {
        id: Date.now(),
        title: title,
        platform: platform,
        status: status,
      };

      setGames([...games, newGame]);
    }

    setTitle("");
    setPlatform("");
    setStatus("Oynanacak");
  }

  function handleEdit(game) {
    setTitle(game.title);
    setPlatform(game.platform);
    setStatus(game.status);
    setEditingId(game.id);
  }

  function handleDelete(id) {
    const remainingGames = games.filter((game) => game.id !== id);
    setGames(remainingGames);
  }

  return (
    <main>
      <h1>Game Tracker</h1>
      <p className="subtitle">Video oyunlarını takip et.</p>

      <h2>{editingId === null ? "Yeni Oyun Ekle" : "Oyunu Güncelle"}</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Oyun Adı</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <label htmlFor="platform">Platform</label>
        <input
          id="platform"
          type="text"
          value={platform}
          onChange={(event) => setPlatform(event.target.value)}
        />

        <label htmlFor="status">Durum</label>
        <select
          id="status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="Oynanacak">Oynanacak</option>
          <option value="Oynanıyor">Oynanıyor</option>
          <option value="Tamamlandı">Tamamlandı</option>
        </select>

        <button type="submit">
          {editingId === null ? "Oyun Ekle" : "Güncelle"}
        </button>
      </form>

      <h2>Oyunlarım</h2>

      {games.length === 0 ? (
        <p>Henüz oyun eklenmedi.</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              <strong>{game.title}</strong>
              <p>Platform: {game.platform}</p>
              <p>Durum: {game.status}</p>

              <button type="button" onClick={() => handleEdit(game)}>
                Düzenle
              </button>

              <button type="button" onClick={() => handleDelete(game.id)}>
                Sil
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;