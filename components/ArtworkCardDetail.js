import useSWR from 'swr'
import Error from 'next/error'
import Card from 'react-bootstrap/Card';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { favouritesAtom }  from '../store'
import { Button } from 'react-bootstrap'

export default function ArtworkCardDetail(props) {
    const { data, error } = useSWR(props.objectID ?`https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}`: null);
    const { properties } = props;

    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const [showAdded, setShowAdded] = useState(false);


if(favouritesList.objectID!=null){
    console.log("Hey lalala");
    setShowAdded(true);
  
}

const favouritesClicked = (e) =>{
    e.preventDefault()

    if(showAdded==true){
        setFavouritesList(current => current.filter(fav => fav != props.objectID));
        
        console.log(favouritesList);

        setShowAdded(false);
    } else if(showAdded==false){
        setFavouritesList(current => [...current, props.objectID]);

        setShowAdded(true);
    }
}




    if(data == null || data == undefined){
        return null
    }
    else if(error){
        return (<><Error statusCode={404} /></>)
    }
    else{
        return (
            <>
                <Card>
                    {data?.primaryImage && <Card.Img variant="top" src={data?.primaryImage} />}
                    <Card.Body>
                        <Card.Title>{data?.title ? data?.title : 'N\/A'}</Card.Title>
                        <Card.Text>
                            <strong>Date: </strong> {data?.objectDate ? data?.objectDate : 'N\/A'}<br />
                            <strong>Classification: </strong> {data?.classification ? data?.classification : 'N\/A'}<br />
                            <strong>Medium: </strong> {data?.medium ? data?.medium : 'N\/A'}<br /><br />
                            <strong>Artist: </strong> {data?.artistDisplayName ? data?.artistDisplayName + " ": 'N\/A'}
                            {data?.artistDisplayName && (( <a href={data?.artistWikidata_URL} 
                            style={{textDecoration: 'none'}} target="_blank" rel="noreferrer" >
                                <span style={{color: 'black'}}>( </span> <u>wiki</u>
                                 <span style={{color: 'black'}}> )</span></a>))}<br/>
                            <strong>Credit Line: </strong> {data?.creditLine ? data?.creditLine : 'N\/A'}<br />
                            <strong>Dimensions: </strong> {data?.dimensions ? data?.dimensions : 'N\/A'}<br />
                        </Card.Text>
                    </Card.Body>
                                {showAdded ? 


                    <Button variant="primary" onClick={favouritesClicked} 
                   >+ Favourite (added)</Button>
                               :  
              <Button variant="outline-primary" onClick={favouritesClicked} 
                              >+ Favourite</Button>
                               }
                </Card>
            </>
        )
    }
}