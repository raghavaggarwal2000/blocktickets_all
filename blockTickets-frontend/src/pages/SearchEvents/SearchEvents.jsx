import React, { useState } from "react";
import "./search-events.css";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
// import EventCard from "../../components/EventCard/EventCard";
import { useEffect } from "react";
import FullLoading from "../../Loading/FullLoading";
import { searchApi } from "../../api/api-client";
import {EventCard} from "../../pages/Events/Events1"


const SearchEvents = () => {
    const { searchKeyWord } = useParams();
    const [loading, setLoading] = useState(true);
    const [eventsData, setEventsData] = useState("");

    const getSearchEvents = async (searchKey) => {
        try {
            const res = await searchApi(searchKey);

            if (res.status === 200) {
                if (res && res.data) {
                    setEventsData(res.data);
                }
                setLoading(false);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };
    useEffect(() => {
        getSearchEvents(searchKeyWord);
    }, [searchKeyWord]);

    useEffect(() => {
    },[eventsData]);
    let currDate = new Date();
    return (
        <div className="search-events">
            <div>
              {/* <img src={} alt="a"/> */}
            </div>
            <h2>Search Result for <i>"{searchKeyWord}"</i></h2>
            {loading === true ? (
                <FullLoading />
            ) : (
                <Container>
                    <Row>
                    {  (eventsData &&
                        eventsData.data &&
                        eventsData.data.refreshResponse && 
                        eventsData.data.refreshResponse.length>0
                        )    ? 
                        
                            (eventsData &&
                            eventsData.data && eventsData.data.refreshResponse && 
                            eventsData.data.refreshResponse.map((item) => {
                                return (item.event && !(currDate > item.event.endDate)) ? (
                                    <Col className="eventCardSearch" >
                                        <EventCard
                                            key={item.event._id}
                                            eventId={item.event._id}
                                            eventImg={item.event.eventImageOriginal}
                                            eventName={item.event.eventTitle}
                                            eventDate={item.event.startDate}
                                            eventStartTime={item.event.startTime}
                                            // price={item.(web3.utils.fromWei(event.transaction[0].price, 'ether')*maticUSD).toFixed(6)}
                                            eventDetails={item.event.eventDescription}
                                            location={item.event.location}
                                        />
                                    </Col>
                                    ) : (
                                        ""
                                    );
                                }).reverse()) :
                                (<p className="not-found">No results found for {searchKeyWord}...</p>)
                                }
                    </Row>
                </Container>
            )}
        </div>
    );
};

export default SearchEvents;
