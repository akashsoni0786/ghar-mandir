import { CalenderIcon, ShareIcon, TempleIcon } from "@/assets/svgs";

 const UpcomingPuja=()=> {
    return <div className="cards-container">
    <div className="cards-details">
        <h2 className="cards-title">Upcoming Pujas</h2>
        <p className="card-description">Experience sacred pujas from trusted temples—personalized rituals, video proof & prasad at your doorstep.</p>
    </div>
    <div className="cards-row">
        <div className="card-participate" style={
            {"--card-bg-url": "url('/assets/card-img_2.png')"} as React.CSSProperties}>
            <div className="card-participate--header" >
                2 Days | 2 Hrs | 15 Mins
            </div>
            <div className="card-participate--data">
                <h3 className="card-participate--title">For financial abundance, health and stability</h3>
                <p className="card-participate--description">Swarnakarshan Bhairav Mantra Jaap,Batuk Bhairav Stotra Path and Havan</p>
                <div className="horizontal-line"></div>
                <div className="card-participate--temple-date">
                    <div className="card-participate--temple">
                        <span><TempleIcon />
                        </span>
                        <span>Mahakaleshwar Temple Premises</span>
                    </div>
                    <div className="card-participate--date">
                        <span><CalenderIcon />
                            </span>
                        <span>12th March, Wednesday, 2025</span>
                    </div>
                </div>
                <div className="card-participate--actions">
                    <div className="card-participate--actions-btn">Participate Now</div>
                    <ShareIcon />
                </div>
            </div>
            

        </div>
    </div>
</div>
}
export default UpcomingPuja;