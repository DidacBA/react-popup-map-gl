import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class ReactPopupMapGL extends Component {

  state = {
    observedNodes: [],
  }

  componentDidMount() {

    this.mounted = true;

    const observedNodes = document.querySelectorAll('.mapboxgl-popup-content');
    
    if (observedNodes.length > 0 && this.mounted) {
      this.setState({
        observedNodes,
      });
    }

    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        const newNodes = mutation.addedNodes;
        newNodes.forEach(node => {
          if (this.mounted && node.classList && node.classList.contains('mapboxgl-popup-content')) {
              this.setState(prevState => ({observedNodes: [node]}));
          }
        });
      });
    });
    
    mutationObserver.observe(document.body, {
      attributes: false,
      characterData: false,
      childList: true,
      subtree: true,
      attributeOldValue: false,
      characterDataOldValue: false
    });

  }

  componentWillUnmount() {

    this.mounted = false;

  }

  render() {
    const observedNodes = [...this.state.observedNodes];
    const portal = (observedNodes.length > 0) ? observedNodes.map((node, i) =>
      (
        <PopUpPortal key={ i } node={ node }>
          {this.props.children} 
        </PopUpPortal>
      )
    ) :
    null;

    return ( { portal } )

  }
}

class PopUpPortal extends Component {
  render() {
    return ReactDOM.createPortal(this.props.children, this.props.node);
  }
}
