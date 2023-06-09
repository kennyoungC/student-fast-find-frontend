import React, { useCallback, useEffect } from "react"
import { Container, Row, Col, Image, Card, Button } from "react-bootstrap"
import { useParams } from "react-router-dom"
import axios from "axios"
import { parseISO, format } from "date-fns"
import { useState } from "react"
import { AiFillStar } from "react-icons/ai"
import { MessageModal } from "./messageModal"
import { multiStateContext } from "../context/contextApi"
import { FaFacebook } from "react-icons/fa"

const Details = () => {
  const { user, handleShowSignIn } = React.useContext(multiStateContext)
  const [productDetails, setProductDetails] = React.useState([])
  const [isMyProduct, setIsMyProduct] = useState(false)
  const [show, setShow] = useState(false)
  const [isOnWatchlist, setIsOnWatchlist] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const params = useParams().id

  const getProductsDetails = useCallback(async () => {
    const token = localStorage.getItem("token")
    await axios
      .get(`https://student-fast-find.herokuapp.com/products/${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProductDetails(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [params])
  const getAllUsersProduct = () => {
    const token = localStorage.getItem("token")
    axios
      .get("https://student-fast-find.herokuapp.com/users/me/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const isMine = res.data?.some((product) => product._id === params)
        setIsMyProduct(isMine)
      })
      .catch((err) => {
        console.log({ err })
      })
  }

  useEffect(() => {
    getProductsDetails()
    getAllUsersProduct()
  }, [])
  const handleFacebookShare = () => {
    const productUrl = `https://student-fast-find.herokuapp.com/products/${params}`
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      productUrl
    )}`
    window.open(shareUrl, "_blank")
  }
  return (
    <Container style={{ marginTop: "24px", marginBottom: "80px" }}>
      <Row>
        <Col md={8}>
          <Card
            className="mt-3"
            style={{
              padding: "10px",
              border: "2px solid var(--primary-color)",
            }}
          >
            <Card.Body>
              <Image
                className="img-fluid mx-auto d-block"
                variant="top"
                src={productDetails.image}
                style={{
                  padding: "10px",
                  border: "1px solid var(--primary-color)",

                  height: "50%",
                  width: "60%",
                }}
              />
              <br />

              <Card.Title>{productDetails.title}</Card.Title>
              <Card.Text>
                {" "}
                <strong>Price:</strong> ${productDetails.price}
              </Card.Text>
              <Card.Text>
                <strong>Location:</strong> {productDetails.location}
              </Card.Text>
              <Card.Text>
                <strong>Posted</strong> on:{" "}
                {productDetails.createdAt
                  ? format(
                      parseISO(productDetails.createdAt),
                      "MMMM do yyyy  || HH:mm "
                    )
                  : "N/A"}
              </Card.Text>
            </Card.Body>
          </Card>
          <Card
            className="mt-3"
            style={{
              padding: "10px",
              border: "2px solid var(--primary-color)",
            }}
          >
            <Card.Body>
              <Card.Text>
                <strong>Condition:</strong> {productDetails.condition}
                {productDetails.condition === "New" ? (
                  <AiFillStar color="red" />
                ) : (
                  <AiFillStar color="grey" />
                )}
              </Card.Text>
              <Card.Text>
                <strong>Description:</strong> {productDetails.description}
              </Card.Text>
            </Card.Body>
          </Card>
          <Card
            className="mt-3"
            style={{
              padding: "10px",
              border: "2px solid var(--primary-color)",
            }}
          >
            <Card.Body>
              <Card.Text>Write a message</Card.Text>
              {!isMyProduct ? (
                <Button
                  style={{
                    backgroundColor: "var(--primary-color)",
                    border: "none",
                  }}
                  onClick={handleShow}
                >
                  Contact Seller
                </Button>
              ) : (
                <Button
                  style={{
                    backgroundColor: "grey",
                    border: "none",
                  }}
                  disabled
                >
                  This is my product
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Button
            style={{
              width: "100%",
              backgroundColor: "var(--primary-color)ange",
              border: "none",
            }}
            className="my-3"
            onClick={handleShow}
          >
            Write a message
          </Button>
          {!isMyProduct && (
            <>
              {isOnWatchlist && (
                <Button
                  style={{
                    width: "100%",
                    backgroundColor: "var(--primary-color)",
                    color: "white",
                    border: "1px solid var(--tertiary-color)",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    justifyContent: "center",
                  }}
                  className="mb-3"
                  onClick={() => {
                    setIsOnWatchlist(false)
                  }}
                >
                  Added to watchlist{" "}
                  <span style={{ marginTop: "-4px" }}>
                    <AiFillStar />
                  </span>
                </Button>
              )}
              {!isOnWatchlist && (
                <Button
                  style={{
                    width: "100%",
                    backgroundColor: "transparent",
                    color: "var(--tertiary-color)",
                    border: "1px solid var(--tertiary-color)",
                  }}
                  className="mb-3"
                  onClick={() => {
                    setIsOnWatchlist(true)
                  }}
                >
                  Add to watchlist
                </Button>
              )}
            </>
          )}
          <Button
            variant="primary"
            style={{
              width: "100%",
              backgroundColor: "transparent",
              color: "var(--tertiary-color)",
              border: "1px solid var(--tertiary-color)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              justifyContent: "center",
            }}
            onClick={() => {
              handleFacebookShare()
            }}
          >
            Share Ad{" "}
            <span style={{ marginTop: "-4px" }}>
              <FaFacebook />
            </span>
          </Button>

          <Card
            className="mt-3"
            style={{
              padding: "10px",
              border: "2px solid var(--primary-color)",
            }}
          >
            <Card.Body>
              <Card.Title> Seller's Contact</Card.Title>
              <Card.Text>
                <strong>Seller:</strong> {productDetails?.poster?.username}
              </Card.Text>
              <Card.Text>
                <strong>Location:</strong> {productDetails?.location}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <MessageModal
        subject={productDetails.title}
        handleClose={handleClose}
        show={show}
        user={user}
        sellerEmail={productDetails?.poster?.email}
        handleShowSignIn={handleShowSignIn}
      />
    </Container>
  )
}

export default Details
