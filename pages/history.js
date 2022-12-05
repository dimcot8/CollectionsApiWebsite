import { useRouter } from "next/router"
import { Card } from "react-bootstrap"
import { Button } from "react-bootstrap"
import { ListGroup } from "react-bootstrap"
import { useAtom } from "jotai"
import { searchHistoryAtom } from "../store"
import styles from "../styles/History.module.css"


export default function History () {
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)
    let parsedHistory = []
    const router = useRouter()


    function historyClicked(e, index) {
        router.push(`/artwork?${searchHistory[index]}`)
    }

    function removeHistoryClicked(e, index) {
        e.stopPropagation();
        setSearchHistory(curr => {
            let x = [...curr]
            x.splice(index, 1)
            return x
        })
    }

    
    searchHistory.forEach(item => {
        let params = new URLSearchParams(item);
        let entries = params.entries();
        parsedHistory.push(Object.fromEntries(entries));
    })


    return (
        <>
            {
                parsedHistory.length > 0 ?
                    <ListGroup>
                        {parsedHistory.map((historyItem, index) => {
                            return (

                             <ListGroup.Item key={index} className={styles.historyListItem}
                              onClick={e => historyClicked(e, index)}>

                     {Object.keys(historyItem).map(key => { return (<>{key}: 
                     <strong>{historyItem[key]}</strong>&nbsp;</>) })}
                            <Button className="float-end" variant="danger" size="sm" onClick={e => removeHistoryClicked(e, index)}>&times;</Button>
                                </ListGroup.Item>
                            ) })}
                    </ListGroup> 
                    :
                    <Card>
                        <Card.Body>
                            <h4>Nothing Here</h4>
                            Try searching for some artwork.
                        </Card.Body>

                    </Card>
            }
        </>
    )
}

