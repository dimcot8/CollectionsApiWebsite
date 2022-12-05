/*********************************************************************************
*  WEB422 – Assignment 5
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Dmytro Benko Student ID: 115223208 Date: 18.11.2022
*
*
********************************************************************************/

import useSWR from 'swr';
import { useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import { Row, Col, Pagination } from 'react-bootstrap';

import Error from 'next/error';
import Card from 'react-bootstrap/Card';
import ArtworkCard from '../../components/ArtworkCard';
import validObjectIDList from '../../public/data/validObjectIDList.json'

const PER_PAGE = 12;

export default function Artwork() {

  const [page, setPage] = useState(1);
  
  const [artworkList, setArtworkList] = useState();

  const router = useRouter();
  let query = router.asPath.split('?')[1];

  const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${query}`);

  function previousPage() {
    if(page> 1)
      setPage(prev => prev - 1);
  }

  function nextPage() {
    if (page <artworkList.length){
      setPage(prev => prev + 1);
    }
  }

  useEffect(() => {
    if (data) {
      let results = [];

      let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));
      
      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        const chunk = filteredResults.slice(i, i + PER_PAGE);
        results.push(chunk);
    }
      setArtworkList(results);

    }

    setPage(1);
  }, [data]);
 

  if(error){
    return (<><Error statusCode={404} /></>)
  }
  if(artworkList){
    return (
      <>
        <Row className="gy-4">
          {artworkList.length > 0 ?
            artworkList[page - 1].map(item => {
              return (
                <Col lg={3} key={item}><ArtworkCard objectID={item} /></Col>
              )
            })  :
            <Card>
              <Card.Body>
                <Card.Text>
                  <strong>Nothing Here</strong><br />
                  Try searching for something else.
                </Card.Text>
              </Card.Body>
            </Card>
          }
        </Row>
        {artworkList.length > 0 && 
        <Row>
          <Col>
              <br />
              <Pagination>
                <Pagination.Prev onClick={previousPage}/>
                <Pagination.Item>{page}</Pagination.Item>
                <Pagination.Next onClick={nextPage}/>
              </Pagination>
          </Col>
        </Row>
        } {
          !artworkList && null 
        }
      </>
    )
  }
}