import React ,{useEffect,useState} from 'react'
import NewsItem from './NewsItem'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from "./spinner"



const News = (props) => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  
  const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
  } 

  const updateNews = async ()=> {
      props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=7916c2346a8d452088e5186fc217d98d&page=${page}&pageSize=${props.pageSize}`; 
     
    setLoading(true)
      let data = await fetch(url);
      props.setProgress(30);
      let parsedData = await data.json()
      props.setProgress(70);
      setArticles(parsedData.articles)
      setTotalResults(parsedData.totalResults)
      setLoading(false)
      props.setProgress(100);
      console.log(parsedData);
  }

  useEffect(() => {
      document.title = `${capitalizeFirstLetter(props.category)} - NewsPigeon`;
      updateNews(); 
      // eslint-disable-next-line
  }, [])


  const fetchMoreData = async () => {   
      const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=7916c2346a8d452088e5186fc217d98d&page=${page+1}&pageSize=${props.pageSize}`;
      setPage(page+1) 
      let data = await fetch(url);
      let parsedData = await data.json()
      setArticles(articles.concat(parsedData.articles))
      setTotalResults(parsedData.totalResults)
    };

      return (
          <>
              <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>NewsPigeon - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
              {loading && <Spinner />}
              <InfiniteScroll
                  dataLength={articles.length}
                  next={fetchMoreData}
                  hasMore={articles.length !== totalResults}
                  loader={<Spinner/>}
              > 
                  <div className="container" >
                       
                  <div className="row" >
                      {articles.map((element) => {
                          return <div className="col-md-4" key={element.url}>
                              <NewsItem title={element.title ? element.title.slice(0, 48) : ""} description={element.description ? element.description.slice(0, 20) : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                          </div>
                      })}
                  </div>
                  </div> 
              </InfiniteScroll>

          </>
      )
  
}
export default News


News.defaultProps = {
  country: 'us',
  pageSize: 8,
  category: 'general',
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}

    
   
 