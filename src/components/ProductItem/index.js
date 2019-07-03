import React from "react";
import { Card, Link, Typography } from "@material-ui/core";
import { ChevronUp } from "mdi-material-ui";
import moment from "moment";
import "./index.css";

export default class ProductItem extends React.Component {
  render() {
    const {
      name,
      createdAt,
      description,
      votesCount,
      url,
      website,
      thumbnail
    } = this.props.data;
    return (
      <div className="item">
        <Card
          style={{ padding: 20 }}
          onClick={this.handleUrl.bind(this, website)}
        >
          <div className="item-container">
            <div className="body">
              <div className="main">
                <img alt="img" className="img" src={thumbnail.url} />
                <div className="main-text">
                  <Typography variant="h5" display="block" gutterBottom>
                    <Link
                      onClick={this.handlePrevent}
                      color={"primary"}
                      target="_blank"
                      rel="noopener noreferrer"
                      href={url}
                    >
                      {name}
                    </Link>
                  </Typography>
                  <p>{description}</p>
                </div>
              </div>
              <div className="side">
                <div className="vote">
                  <ChevronUp />
                  <div style={{ fontWeight: "700" }}>{votesCount}</div>
                </div>
              </div>
            </div>
            <div className="footer">Created at {moment(createdAt).format('YYYY/MM/DD HH:mm')}</div>
          </div>
        </Card>
      </div>
    );
  }
  handlePrevent = e => {
    e.preventDefault();
  };
  handleUrl = url => {
    window.open(
      url,
      "_blank" // <- This is what makes it open in a new window.
    );
  };
}
