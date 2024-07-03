<article className="artist-block">
  {datesGroupedByArtiste[artisteID][0].artiste.img_url && (
    <img
      className="profil-pic"
      src={datesGroupedByArtiste[artisteID][0].artiste.img_url}
    />
  )}
  <div className="artist-block-name">
    <h2>{datesGroupedByArtiste[artisteID][0].artiste.artiste_name}</h2>
  </div>
</article>;
