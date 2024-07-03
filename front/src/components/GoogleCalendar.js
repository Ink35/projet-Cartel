import { useState } from "react";

const GoogleCalendar = () => {
  const [status, setStatus] = useState("confirmed");

  const handleClick = (option) => {
    setStatus(option);
  };

  const linkProduction =
    "https://calendar.google.com/calendar/ical/83108cdc65e36efc1afab67a9a2171c50433ac7b9604139bd9233d7e242aef67%40group.calendar.google.com/private-26add0c4d4695c6bb13d22413a519294/basic.ics";
  const linkOption =
    "https://calendar.google.com/calendar/ical/e6bf92a8087f2fe999193a72232cf3f7cb684c42932c9ed3d3ce11e031e162a3%40group.calendar.google.com/private-c4c803454506d1af89f77c659ca54c49/basic.ics";
  const linkVente =
    "https://calendar.google.com/calendar/ical/7b9d90d0923681d9b6f06635cc6cedf9d285d43e3ed034c1fb8f771e885e135a%40group.calendar.google.com/private-ed3931acbf7bcd99373140e22318d5e5/basic.ics";

  const copyToClipboard = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      alert("Lien copié dans le presse-papier !");
    } catch (err) {
      console.error("Erreur lors de la copie du lien : ", err);
    }
  };

  return (
    <section className="calendar-block">
      <article className="calendar-button">
        <button
          className={status === "confirmed" ? "active" : null}
          onClick={() => handleClick("confirmed")}
        >
          Production
        </button>
        <button
          className={status === "option" ? "active" : null}
          onClick={() => handleClick("option")}
        >
          Option
        </button>
        <button
          className={status === "vente" ? "active" : null}
          onClick={() => handleClick("vente")}
        >
          Vente
        </button>
      </article>
      {status && status === "confirmed" ? (
        <>
          <iframe
            title="production calendar"
            className="google-calendar"
            src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FParis&bgcolor=%23ffffff&showCalendars=0&showTitle=0&showTz=0&hl=fr&showPrint=0&src=ODMxMDhjZGM2NWUzNmVmYzFhZmFiNjdhOWEyMTcxYzUwNDMzYWM3Yjk2MDQxMzliZDkyMzNkN2UyNDJhZWY2N0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%2333B679"
          ></iframe>
          <h2>Lien a ajouter a son calendrier pour avoir Production :</h2>
          <button onClick={() => copyToClipboard(linkProduction)}>
            Copier le lien
          </button>
        </>
      ) : null}
      {status && status === "option" ? (
        <>
          <iframe
            title="option calendar"
            className="google-calendar"
            src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FParis&bgcolor=%23ffffff&showCalendars=0&showTitle=0&showTz=0&hl=fr&showPrint=0&src=ZTZiZjkyYTgwODdmMmZlOTk5MTkzYTcyMjMyY2YzZjdjYjY4NGM0MjkzMmM5ZWQzZDNjZTExZTAzMWUxNjJhM0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23F09300"
          ></iframe>
          <h2>Lien a ajouter a son calendrier pour avoir Option :</h2>
          <button onClick={() => copyToClipboard(linkOption)}>
            Copier le lien
          </button>
        </>
      ) : null}
      {status && status === "vente" ? (
        <>
          <iframe
            title="vente calendar"
            className="google-calendar"
            src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FParis&bgcolor=%23ffffff&showCalendars=0&showTitle=0&showTz=0&hl=fr&showPrint=0&src=N2I5ZDkwZDA5MjM2ODFkOWI2ZjA2NjM1Y2M2Y2VkZjlkMjg1ZDQzZTNlZDAzNGMxZmI4Zjc3MWU4ODVlMTM1YUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%233F51B5"
          ></iframe>
          <h2>Lien a ajouter a son calendrier pour avoir Vente :</h2>
          <button onClick={() => copyToClipboard(linkVente)}>
            Copier le lien
          </button>
        </>
      ) : null}
    </section>
  );
};

export default GoogleCalendar;
