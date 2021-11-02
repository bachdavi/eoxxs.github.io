@def title = "A Computational Mind"
@def hasmath = true

# A Computational Mind

How can a computational approach help us gain insights into the
workings of the mind?

It is apparent that the human mind can act in a way a computer does,
by following rules, such as manipulating symbols, to compute
arithmetic expressions. Importantly the human executing the list of
instructions does not need to comprehend what these symbols mean, he
simply needs to obey the rules. The important analogy between human
reasoning and execution of a computer program is that both need to
continuously reduce a problem to more and more fundamental truths,
which then can be understood in isolation.  These then are iteratively
combined until the initial statement is understood/computed.

These hints lead to the questions, if we could not simply assume that
the nervous system is a computing system, consisting of individual
computing units, the neurons.
Even though neurons are physically analog, they follow a "all or nothing" rule.

Modeling these neurons as building blocks in logic networks,
\cite{mcculloch90_logic_calcul_ideas_imman_nervous_activ} pioneered
the idea of the brain as a logical inference engine. The usage of AND
$\wedge$ , OR $\vee$ or NOT $\neg$ in the interaction of neurons can
model the response of any one neuron given its neighbors.

One now could assume that the mind is but a series of computed logical
functions. \cite{putnam67_natur_mental_states} provides a different
view. The mind and its mental states are functions of the
computational process. Direct one-to-one mappings between
physiological brain states and mental states would then not exist.
This view is revised by
\cite{fodor74_special_scien_or_disun_scien}. He argues that it is
highly unlikely that we will find a decomposition of the brain that is
a direct analog of the psychology of the brain. He makes the argument
that even if that would be the case, 

> ... then there are only epistemological reasons for studying the former
> instead of the latter.

In a extreme view, the functional state would be completely
decoupled from the physical state of the underlying structure. There
would be no hope to understand the mind by observing the structure it
is implemented on. \cite{chalmers94_comput_found_study_cognit} loosens
this assumption by arguing the the causal structure of the physical
system must mirror the formal structure of the computation.  To
whatever degree we assume the decouplement of function and structure,
it opens the door to different realizations of the same mental state
from different physical states. This in turn leads to the idea of
machines possessing the same mental states as we humans do.

Following this functional paradigm we need to ask ourselves, what are
these functions and what do they compute.  We can view functions from
a mathematical point of view. As mappings between in- and outputs.
The inputs are perceptions of the physical world, proprioception and
exteroception, and the outputs are meaning or models. This in essences
means that perceptive functions apply meaning to what is being
experienced and thus relate to it.  From an evolutionary point of view
this makes sense, as the better organisms can relate to or model what
is being experienced the better they can act upon
it. \cite{dennett17_from_bach} put it the following way: 

>Brains are designed by natural selection to have, or reliably
>develop, equipment that can extract the semantic information needed
>for this control task.

Perception thus seems to be the first encounter that a mental state
and its associated functions have. The act of perception is one of
categorization. It a an impressive feat on its own, to decode raw
sensory data and then infer on it.  Models for this process of
inferring meaning from data has their roots in Bayesian probability
theory. Different hypothesis and their prio probability exist and by
observing information/evidence the posterior distribution is
inferred. The most likely explanation is then assigned as the meaning
of the perception.  

As an example we can take visual categorization. We start with a set
of given categories, in a sense the prio distributions above, and a
perception on our retina. The function the brain needs to implement
maps this image into one of the given categories.  This function needs
to map a enormous amount of visual input to a small set of categories
reliable and fast. We seem to do it effortless, but thinking about
programming such a function in a imperative manner is almost
incomprehensible. Nowadays this problem is solved using machine
learning and exemplified data.  A trained neural network can reach
high amounts of fidelity in categorizing images.  This process of
training an algorithm seems familiar in the evolutionary context. The
brain is a "living computational system" continuously learning from
data and programming itself, on the level of individuals.  In the
machine learning space Deep Neural Networks are the frontier of
computing such complex task, and they do with great precision. They
are modeled after the neurons in the brain. In general the techniques
use gradient descend methods to optimize a given loss function,
e.g. categorizing cat pictures.  The rise of machine learning in the
last decades has given us the opportunity to create functions that
compute a task the brain does and thus given us access to study those
functions and systems they are implemented on.

There exist different opinions about neural networks as merely another
specific implementation of a Turing machine, and as such not providing
any more insight about mental representations, or a more fundamental
process of extracting and reducing to relevant information, which is
needed for mental representations. Staying at the example of
categorizing images, we can also think of it as learning
representations. Can deep neural networks also learn meaningful
intermediate representations? In other words, the process of reducing
the high dimensional data leads to the representation of features
along the way to the actual task at hand.  Fundamentally
representations are created by reduction. The functions performing
this information reduction have been acquired by organism for a
purpose, usually to improve its chances of survival.

Another interesting area to investigate the creation and processing of
representations is in the space of language.  How can we acquire
semantic representations?  There are different opinions, from a
"mental encyclopedia" in which the meaning of words is following the
reference into the encyclopedia to find it, like a look-up in a table
\cite{pinker11_words_rules}, to an innate existing of lexical concepts
that are atomic and as such cannot be learned.  Criticism for both
exists, the former needs a preexisting table and the second one leads
to absurd consequences of all conceivable meaning already innate in
every human.  Following a more deductive approach we can model the
meaning of words as a point in a "vector space", where relating
concept are "close" in a distant measure sense and together build a
connected graph.  These structures again can be learned, such that
points correspond to probability distribution over relating
concepts. New concepts can be acquired by locating it in the space and
appropriately altering the connections and distributions.  We can show
that semantic and syntactic representations can be learned through
these intermediate representations.  This intermediate representation
can again be used to translate between, e.g. visual and audio
information, as shown by algorithms that can categorize an image and
create language describing them.  From language it is not far fetching
to describe thought via an algorithm. We think in a mental language
and thoughts are but a continuous stream of related mental
representations.

\cite{chalmers94_comput_found_study_cognit} argues that most mental
properties and processes are organizational invariant, in that we
might change and substitute the underlying structure but as long as we
maintain its causal properties, we preserve its mental properties.
The idea can be reformulated from a physics point of view. The first
thing we can argue is that information is substrate independent. We
may represent bits of information via transistors, neurons, magnetic
states or light. The underlying, physical representation does not
change the containing information. Otherwise we would need to
physically move the matter to transmit information, a ghastly image.
If information is substrate independent, so must be information
processing. There exists an abstract notion of processing information,
which does not rely on the physical implementation executing
it. Furthermore we can argue that any computational process is merely
one of information processing and thus we arrive at Chalmers
statement.  If we assume that there exist not such a thing as
conscious or mind matter, a special sort of matter that, if
information processing would be implemented on it, would expose of
mental processes, we inevitably arrive at the notion of computational
sufficiency, describe again in
\cite{chalmers94_comput_found_study_cognit}.  If a system implements
the very same function as mental processes do, it possesses mental
properties.

Chalmers proposes the next step in this reasoning, what he coins
Computational Explanation, that the computational framework can be
used to explain mental phenomena.  In other words: If we understand
the function that is being computed we understand the mental process
and vice versa. It a mathematical description:

$$ \text{Computational Properties} \Longleftrightarrow \text{Mental
Properties} $$ This does of course not answer the question which
functions lead to mental states and which not, but it gives us a
general framework in which we can investigate such properties.

# Conclusion
Over the last years improvement in the artificial intelligence space
shows that more and more, prior unthinkable, computational tasks have
been solved. Learning is the prominent reason for that. Through this
the evidence that mental state are describable via computation seems
apparent. On the other hand neural networks are often black boxes and
its not clear if any actual meaning is inferred. Adding to this are
notorious robustness
issues. \cite{carlini16_towar_evaluat_robus_neural_networ} show that a
small change in an input image can lead to completely different
classifications, even though for a human observer nothing has
changed. These and similar results, where neural networks are duped in
such subtle ways, show that inside the neural network there exists no
such thing like a mental representation of what has been learned. Or
at least not yet.

To conclude, the basic premise that mental states are despicable in a
functional and computational way is a very pervasive model and allows
us to build and reason about what mental processes are, with a toolkit
that has been developed over the last 50 years.

# References


* \biblabel{mcculloch90_logic_calcul_ideas_imman_nervous_activ}{McCulloch,
  W. S. & Pitts, W. (1990)} **McCulloch**, **Pitts**, A logical
  calculus of the ideas immanent in nervous activity. 1943. Bulletin
  of mathematical biology, 52 1-2(), 99–115–73–97.
* \biblabel{putnam67_natur_mental_states}{Putnam, H. (1967)}
  **Putnam**, The nature of mental states. In W. Capitan, & D. Merrill
  (Eds.), Art, Mind, and Religion (pp. 1–223). Pittsburgh University
  Press.
* \biblabel{fodor74_special_scien_or_disun_scien}{Fodor, J. A. (1974)}
  **Fodor**, Special sciences, or disunity of science as a working
  hypothesis. Synthese, 28(2), 97–115.
* \biblabel{chalmers94_comput_found_study_cognit}{Chalmers,
  D. J. (1994)} **Chalmers**, A computational foundation for the study
  of cognition. Minds And Machines. 1994.
* \biblabel{dennett17_from_bach}{Dennett, D. C. (2017)} **Dennett**,
  From Bacteria to Bach and Back : The Evolution of Minds.
* \biblabel{pinker11_words_rules}{Pinker, S. (2011)} **Pinker**, Words
  and rules (1999/2011). New York, Harper Perennial.
* \biblabel{carlini16_towar_evaluat_robus_neural_networ}{Carlini, N.
  & Wagner, D. A. (2016)} **Carlini**, **Wagner**, Towards evaluating
  the robustness of neural networks. CoRR, abs/1608.04644().






